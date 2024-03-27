import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../Models/ApiResponse';
import { environment } from '../../environments/environment';
import { Exame } from '../Models/Exame';

@Injectable({
  providedIn: 'root'
})
export class ExamesService {
  constructor(private http$: HttpClient) { }

  private urlapi$ = 'exames';

  public GetExames(idSessao: string, dataInicial?: string, dataFinal?: string):Observable<ApiResponse<Exame[]>>{
    const httpOptions$ = {headers: new HttpHeaders({'Content-Type': 'application/json'})}
    let params = new HttpParams()
      .set('sessao', idSessao)
      .set('Pagina', '1')
      .set('QtPagina', '1000')
    if (dataInicial !== undefined) {
      params = params.set('DataInicial', dataInicial);
    }
    if (dataFinal !== undefined) {
      params = params.set('DataFinal', dataFinal);
    }
    return this.http$.get<ApiResponse<Exame[]>>(`${environment.apiURL}/${this.urlapi$}`, {params:  params, ...httpOptions$});
  }

}
