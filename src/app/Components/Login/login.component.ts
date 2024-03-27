import { Component, OnInit, ViewChild } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../Services/auth.service';
import { ApiResponse } from '../../Models/ApiResponse';
import { UserResponse } from '../../Models/UserResponse';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  @ViewChild(LoginComponent) loginComponent!: LoginComponent;

  constructor(
    private router: Router,
    private authService: AuthService,
    private formbuilder: FormBuilder
  ) {}

  showSpan = false;
  responseError = false;
  responseMessageError = '';
  fieldTextType: boolean;

  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
      User: [''],
      Password: [''],
    });
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  login() {
    const formData = this.loginForm.value;
    this.showSpan = true;
    
    this.authService.login(formData).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ocorreu um erro ao processar sua solicitação.';
        if (error.error) {
          errorMessage = `${error.error.Error}`;
        } else if (error.status) {
          errorMessage = `${error.status}: ${error.error.Error}`;
        }      
        this.showSpan = false;
        this.responseError = true;
        this.responseMessageError = errorMessage;
        
        setTimeout(() => {
          this.responseError = false;
        }, 3000);
        
        return throwError(() => error);
      })
    ).subscribe((response: ApiResponse<UserResponse>) => {
      this.showSpan = false;
      this.responseError = false;
      this.authService.setAuthSessao(response);
      this.router.navigate(['/']);
    });
  }
  
}
