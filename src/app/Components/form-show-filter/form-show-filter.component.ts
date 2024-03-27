import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ApiResponse } from '../../Models/ApiResponse';
import { Exame } from '../../Models/Exame';
import { AuthService } from '../../Services/auth.service';
import { ExamesService } from '../../Services/exames.service';
import { DownloadService } from '../../Services/download.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import Swal from 'sweetalert2';
import { formatarDataParaString } from '../../Helpers/FormatarData';

@Component({
  selector: 'app-form-show-filter',
  templateUrl: './form-show-filter.component.html',
  styleUrls: ['./form-show-filter.component.css']
})
export class FormShowFilterComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataMin: string;
  dataMax: string;
  requisicao: string;
  nomePaciente: string;
  listaDeExames: Exame[] = [];
  ApiResult: ApiResponse<Exame[]>;
  localStorageItens: { tipoUsuario: string | null, sessao: string | null };

  
  displayedColumns: string[] = ['Data', 'Nr.Exame', 'Nr.Guia', 'Previsão de Resultado', 'Paciente', 'Exame', 'Situação', 'Laudo'];
  dataSource: MatTableDataSource<Exame>;

  constructor(private examesService$: ExamesService, private authService$: AuthService, private downloadService$: DownloadService) {}
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  
  ngOnInit(): void {
    this._getLocalStorage();
    this.GetListaExames();
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterByData(): void {
    let dataMinFormatted = formatarDataParaString(this.dataMin);
    let dataMaxFormatted = formatarDataParaString(this.dataMax);
    this.GetListaExames(dataMinFormatted,dataMaxFormatted);
  }
  
  GetListaExames(dataMinFormatted?: string, dataMaxFormatted?: string) {
    this.examesService$.GetExames(this.localStorageItens.sessao!, dataMinFormatted, dataMaxFormatted)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error) {
            console.log(error.error.Error);
          }
          return throwError(() => error.error);
        })
      )
      .subscribe((response: ApiResponse<Exame[]>) => {
        this.ApiResult = response;
        this.listaDeExames = this.ApiResult.Data;
        this.dataSource = new MatTableDataSource(this.listaDeExames);
        console.log(this.listaDeExames.length)
      });
  }

  private _getLocalStorage() {
    this.localStorageItens = this.authService$.getAuthSessao();
  }

  protected DownloadPDF(event: MouseEvent) {
    try {
        const nrExame = (event.target as HTMLButtonElement).value;
        if (this.listaDeExames.length > 0) {
          let nrExameFormatado = nrExame!.replace('/', '');
          this.downloadService$.DownloadPDF(this.localStorageItens.sessao!, nrExameFormatado);
        } else {
          console.log('Erro ao resgatar dados do exame');
        } 
      } catch (error) {
        console.error('Erro ao fazer download do laudo:', error);
        Swal.fire('Erro ao fazer download do laudo','Tente novamente, se o problema persistir procure o administrador do sistema.','error')
      }
  }
}


