export function formatarDataParaString(dataString: string): string {
    // Convertendo a string para objeto Date
    const data = new Date(dataString);
    
    // Verificando se a conversão foi bem sucedida
    if (isNaN(data.getTime())) {
      return dataString;
    }
    
    // Convertendo a data para o formato desejado
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    let dataAjustada = new Date(data);
    dataAjustada.setMinutes(dataAjustada.getMinutes() + dataAjustada.getTimezoneOffset());
    
    return dataAjustada.toLocaleDateString('pt-BR', options);
}