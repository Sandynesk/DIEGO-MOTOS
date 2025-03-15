// Função para adicionar os produtos na tabela

let valorTotalSemDesconto = 0;
let valorTotalComDesconto = 0;
function enviarFormulario() {
    // Pegar os valores do formulário
    const nome = document.getElementById('nome').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const quantidade = parseInt(document.getElementById('quantidade').value);

    // Verificar se os campos foram preenchidos corretamente
    if (!nome || isNaN(preco) || isNaN(quantidade)) {
        alert('Por favor, preencha todos os campos corretamente!');
        return;
    }

    // Cálculos
    const precoTotal = preco * quantidade;
    const precoComDesconto = precoTotal - (precoTotal * 0.06); // 6% de desconto
    const diferencaDesconto = precoTotal - precoComDesconto;

    
    // Atualizar os totais acumulados
    valorTotalSemDesconto += precoTotal;
    valorTotalComDesconto += precoComDesconto;

    // Criar uma nova linha na tabela
    const tabela = document.getElementById('productTableBody');
    const novaLinha = document.createElement('tr');

    novaLinha.innerHTML = `
        <td>${nome}</td>
        <td>R$ ${preco.toFixed(2)}</td>
        <td>${quantidade}</td>
        <td>R$ ${precoTotal.toFixed(2)}</td>
        <td>R$ ${precoComDesconto.toFixed(2)}</td>
        <td>R$ ${diferencaDesconto.toFixed(2)}</td>
        <td><button class="btn btn-danger" onclick="removerProduto(this)">Remover</button></td>
    `;

    // Adicionar a nova linha na tabela
    tabela.appendChild(novaLinha);

    // Atualizar os valores totais no rodapé
    document.getElementById('valorTotalSemDesconto').textContent = `R$ ${valorTotalSemDesconto.toFixed(2)}`;
    document.getElementById('valorTotalComDesconto').textContent = `R$ ${valorTotalComDesconto.toFixed(2)}`;

    // Limpar o formulário
    document.getElementById('productForm').reset();
}


// Função para remover um produto da tabela
function removerProduto(botao) {
    const linha = botao.parentNode.parentNode; // Pega a linha (tr) que contém o botão
    const precoTotal = parseFloat(linha.children[3].textContent.replace('R$ ', '').replace(',', '.'));
    const precoComDesconto = parseFloat(linha.children[4].textContent.replace('R$ ', '').replace(',', '.'));

    // Subtrair os valores removidos dos totais acumulados
    valorTotalSemDesconto -= precoTotal;
    valorTotalComDesconto -= precoComDesconto;

    // Remover a linha da tabela
    linha.remove();

    // Atualizar os valores totais no rodapé
    document.getElementById('valorTotalSemDesconto').textContent = `R$ ${valorTotalSemDesconto.toFixed(2)}`;
    document.getElementById('valorTotalComDesconto').textContent = `R$ ${valorTotalComDesconto.toFixed(2)}`;
}


// Função para exportar para PDF
function exportarPDF() {
    console.log("Função exportarPDF chamada");

    // Verifica se a tabela tem dados
    const table = document.getElementById('productTableBody');
    if (table.rows.length === 0) {
        alert("Não há produtos para exportar!");
        return;
    }

    const { jsPDF } = window.jspdf; // Acessa a biblioteca jsPDF
    const doc = new jsPDF(); // Cria um novo documento PDF

    // Adiciona um título ao PDF
    doc.setFontSize(16);
    doc.text('Lista de Produtos', 14, 20);

    // Cabeçalhos da tabela
    const headers = [
        ['Produto', 'Preço Unitário', 'Quantidade', 'Total', 'Preço com Desconto 6%', 'Diferença']
    ];

    const rows = [];

    // Percorre as linhas da tabela e adiciona os dados ao PDF
    for (let row of table.rows) {
        const rowData = [];
        for (let i = 0; i < row.cells.length - 1; i++) { // Ignora a coluna de "Ação"
            rowData.push(row.cells[i].textContent.trim());
        }

        // Adiciona os dados da linha ao array de rows
        rows.push(rowData);
    }

    console.log("Dados da Tabela:", rows); // Verifique os dados que estão sendo extraídos

    // Ajuste da largura das colunas para que fiquem mais adequadas
    try {
        doc.autoTable({
            head: headers,  // Cabeçalhos da tabela
            body: rows,     // Dados das linhas
            startY: 30,     // Começar 30mm abaixo do topo
            theme: 'grid',  // Tema com linhas de grade
            headStyles: { fontSize: 12, fontStyle: 'bold' }, // Estilos dos cabeçalhos
            bodyStyles: { fontSize: 10 }, // Estilos do corpo
            columnStyles: {
                0: { cellWidth: 'auto' },   // Largura automática para a coluna "Produto"
                1: { cellWidth: 30 },       // Largura fixada para "Preço Unitário"
                2: { cellWidth: 20 },       // Largura fixada para "Quantidade"
                3: { cellWidth: 20 },       // Largura fixada para "Total"
                4: { cellWidth: 40 },       // Largura fixa para "Preço com Desconto"
                5: { cellWidth: 30 }        // Largura fixa para "Diferença"
            },
        });

        // Adicionar o valor total no final do PDF
        doc.setFontSize(12);
        const valorTotalTexto = `Valor Total: R$ ${valorTotalSemDesconto.toFixed(2)}`;
        doc.text(valorTotalTexto, 14, doc.lastAutoTable.finalY + 10); // +10 para posicionar logo abaixo da tabela
        
        doc.setFontSize(12);
        const valorTotalTextoDesconto = `Valor Total (Desconto): R$ ${valorTotalComDesconto.toFixed(2)}`;
        doc.text(valorTotalTextoDesconto, 14, doc.lastAutoTable.finalY + 20); // +20 para posicionar logo abaixo da tabela



        // Fazendo o download do PDF
        doc.save('produtos.pdf');
    } catch (error) {
        console.error("Erro ao gerar o PDF:", error);
    }
}
