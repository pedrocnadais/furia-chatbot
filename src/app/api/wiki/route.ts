import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const title = searchParams.get('title');
  const keyword = searchParams.get('keyword'); // Agora buscamos por palavra-chave

  if (!title) {
    return NextResponse.json({ error: 'Missing "title" parameter' }, { status: 400 });
  }

  try {
    const summaryUrl = `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const res = await fetch(summaryUrl);
    const data = await res.json();

    const fullText = data.extract || '';

    if (!keyword) {
      return NextResponse.json({ content: fullText });
    }

    // Buscar pelo trecho com a palavra-chave
    const lowerText = fullText.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();
    
    if (lowerText.includes(lowerKeyword)) {
      // Pegamos o parágrafo onde a palavra-chave aparece
      const paragraphs = fullText.split('\n');
      const match = paragraphs.find((p) => p.toLowerCase().includes(lowerKeyword));

      return NextResponse.json({ content: match || 'Conteúdo relacionado encontrado, mas vazio.' });
    } else {
      return NextResponse.json({ content: 'Nenhuma informação relacionada encontrada.' });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao acessar Wikipedia.' }, { status: 500 });
  }
}
