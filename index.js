const remuneracaoInput = document.getElementById('remuneracao');

//seleciona o campo de entrada e adiciona um ouvinte de evento que dispara sempre que o valor input muda
remuneracaoInput.addEventListener('input', function(e) {
    let valor = e.target.value;

    //remove tudo o que não é número
    valor = valor.replace(/\D/g, '');

    //converte para número decimal
    valor = (valor / 100).toFixed(2);

    //formata para o padrão monetário brasileiro
    valor = valor.replace('.', ',');

    //adiciona pontos a cada milhar
    valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    //adiciona o símbolo "R$" no início
    e.target.value = 'R$ ' + valor;
});

//cartão de crédito
document.getElementById('adicionar-cartao').addEventListener('click', function() {
    const container = document.getElementById('cartoes-container');
    const novoCartao = document.createElement('div');
    novoCartao.classList.add('cartao');
    novoCartao.innerHTML = `
        <input type="text" name="nomeCartao[]" placeholder="Nome do Cartão">
        <input type="text" class="valorFatura" name="valorFatura[]" placeholder="R$ 0,00">
        <input type="date" name="dataFechamento[]" placeholder="Data de Fechamento">
        <input type="date" name="dataVencimento[]" placeholder="Data de Vencimento">
        <div class="parcelamento">

        </div>
        <button type="button" class="adicionar-parcelamento">Adicionar Parcelamento</button>
        `;
    container.appendChild(novoCartao);
});

//para adicionar parcelamento
document.addEventListener('click', function(e) {
    if(e.target.classList.contains('adicionar-parcelamento')) {
        const cartao = e.target.closest('.cartao');
        const parcelamentosContainer = cartao.querySelector('.parcelamentos');
        const novoParcelamento= document.createElement('div');
        novoParcelamento.classList.add('parcelamento');
        novoParcelamento.innerHTML = `
            <input type="text" name="parcelamento[]" placeholder="Parcelamento">
            <input type="number" name="parcelaAtual[]" placeholder="Parcela Atual">
            <input type="number" name="totalParcelas[]" class="totalParcelas" placeholder="Total de Parcelas">
            <input type="text" class="valorParcela" name="valorParcela[]" placeholder="R$ 0,00">
            <input type="text" class="valorTotalCompra" name="valorTotalCompra[]" placeholder="R$ 0,00" readonly>
        `;
        parcelamentosContainer.appendChild(novoParcelamento);
    }
});

//Para formatar os campos de valor do cartão
function formatarMoeda(campo){
    let valor = campo.value.replace(/\D/g, '');
    valor = (valor/100).toFixed(2).replace('.', ',');
    valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    campo.value = 'R$ ' + valor;
}

document.addEventListener('input', function(e){
    if(e.target.classList.contains('valorFatura')){
        formatarMoeda(e.target);
    }
});

//para formatar os campos de valor do parcelamento
document.addEventListener('input', function(e){
    if(e.target.classList.contains('valorFatura') ||
        e.target.classList.contains('valorParcela') ||
        e.target.classList.contains('valorTotalCompra')){
            formatarMoeda(e.target);
    }
});

//para formatar moeda em número
function formatarMoedaParaNumero(valor){
    return parseFloat(valor.replace('R$ ', '').replace(/\./g,'').replace(',','.')) || 0;
}

//para formatar número em valor monetário
function formatarNumeroParaMoeda(valor){
    let valorFormatado = valor.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})
    return 'R$' + valorFormatado;
}

//para calcular o valor total da compra
document.addEventListener('input', function(e){
    if(e.target.classList.contains('valorParcela') || e.target.closest('.parcelamento')) {
        const parcelamentoDiv = e.target.closest('.parcelamento');
        const valorParcelaCampo = parcelamentoDiv.querySelector('.valorParcela');
        const totalParcelasCampo = parcelamentoDiv.querySelector('.totalParcelas');
        const valorTotalCompraCampo = parcelamentoDiv.querySelector('.valorTotalCompra');

        //converter valores dos campos
        const valorParcela = formatarMoedaParaNumero(valorParcelaCampo.value);
        const totalParcelas = parseInt(totalParcelasCampo.value) || 0;

        //calcular valor total
        if (valorParcela && totalParcelas){
            const valorTotal = valorParcela * totalParcelas;
            valorTotalCompraCampo.value = formatarNumeroParaMoeda(valorTotal);
        } else {
            valorTotalCompraCampo.value = 'R$ 0,00';
        }
    }
});

//evento de input aos campos de valor da parcela
document.addEventListener('input', function(e){
    if(e.target.classList.contains('valorParcela')){
        formatarMoeda(e.target);  
    }
    if (e.target.classList.contains('valorParcela') || e.target.classList.contains('totalParcelas')){
        //aqui já fazemos o cálculo no evento acima
    }
});
