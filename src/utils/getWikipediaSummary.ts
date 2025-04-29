export async function getWikipediaSummary(title: string, keyword?: string): Promise<string> {
 try {
   const url = `/api/wiki?title=${encodeURIComponent(title)}${keyword ? `&keyword=${encodeURIComponent(keyword)}` : ''}`;
   const res = await fetch(url);

   if (!res.ok) {
     throw new Error('Erro ao buscar dados');
   }

   const data = await res.json();
   return data.content || 'Conteúdo não encontrado.';
 } catch (error) {
   console.error(error);
   return 'Erro ao buscar dados da Wikipedia.';
 }
}
