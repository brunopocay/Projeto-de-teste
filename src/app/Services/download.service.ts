import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  constructor(private http$: HttpClient) { }
  apiUrl = 'exames/Download';

  public DownloadPDF(idSessao: string, nrExame: string){
    window.open(`${environment.apiURL}/${this.apiUrl}?sessao=${idSessao}&NrExame=${nrExame}`, '_blank');
  }
}
