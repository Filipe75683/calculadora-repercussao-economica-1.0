// JavaScript para cálculo de 20 Salários
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('salarios-form');
    const inputs = form.querySelectorAll('input, select');
    
    // Elementos de resultado
    const vinteSalariosEl = document.getElementById('vinte-salarios');
    const terceirosMensalEl = document.getElementById('terceiros-mensal');
    const valorMaiorMensalEl = document.getElementById('valor-maior-mensal');
    const economiaPeriodoEl = document.getElementById('economia-periodo');
    
    // Tabela de histórico
    const historicoTable = document.getElementById('historico-table').getElementsByTagName('tbody')[0];
    const adicionarHistoricoBtn = document.getElementById('adicionar-historico');
    const limparHistoricoBtn = document.getElementById('limpar-historico');
    
    // Array para armazenar histórico
    let historico = JSON.parse(localStorage.getItem('historico-salarios') || '[]');
    
    // Função para formatar moeda
    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }
    
    // Função para calcular
    function calcular() {
        const ano = parseInt(document.getElementById('ano').value) || 0;
        const salarioMinimo = parseFloat(document.getElementById('salario-minimo').value) || 0;
        const valorTerceiros = parseFloat(document.getElementById('valor-terceiros').value) || 0;
        const mesesCalculo = parseInt(document.getElementById('meses-calculo').value) || 12;
        
        if (salarioMinimo === 0 || valorTerceiros === 0) {
            // Limpar resultados se não há dados suficientes
            vinteSalariosEl.textContent = formatCurrency(0);
            terceirosMensalEl.textContent = formatCurrency(0);
            valorMaiorMensalEl.textContent = formatCurrency(0);
            economiaPeriodoEl.textContent = formatCurrency(0);
            return;
        }
        
        // Cálculos
        const vinteSalarios = salarioMinimo * 20;
        const terceirosMensal = valorTerceiros / 12; // Assumindo que o valor é anual
        const valorMaiorMensal = Math.max(0, terceirosMensal - vinteSalarios);
        const economiaPeriodo = valorMaiorMensal * mesesCalculo;
        
        // Atualizar resultados
        vinteSalariosEl.textContent = formatCurrency(vinteSalarios);
        terceirosMensalEl.textContent = formatCurrency(terceirosMensal);
        valorMaiorMensalEl.textContent = formatCurrency(valorMaiorMensal);
        economiaPeriodoEl.textContent = formatCurrency(economiaPeriodo);
    }
    
    // Função para adicionar ao histórico
    function adicionarAoHistorico() {
        const ano = parseInt(document.getElementById('ano').value) || 0;
        const salarioMinimo = parseFloat(document.getElementById('salario-minimo').value) || 0;
        const valorTerceiros = parseFloat(document.getElementById('valor-terceiros').value) || 0;
        
        if (ano === 0 || salarioMinimo === 0 || valorTerceiros === 0) {
            alert('Por favor, preencha todos os campos obrigatórios antes de adicionar ao histórico.');
            return;
        }
        
        const vinteSalarios = salarioMinimo * 20;
        const terceirosMensal = valorTerceiros / 12;
        const valorMaiorMensal = Math.max(0, terceirosMensal - vinteSalarios);
        const economiaAnual = valorMaiorMensal * 12;
        
        const novoItem = {
            ano: ano,
            salarioMinimo: salarioMinimo,
            vinteSalarios: vinteSalarios,
            valorTerceiros: valorTerceiros,
            valorMaiorMensal: valorMaiorMensal,
            economiaAnual: economiaAnual,
            dataCalculo: new Date().toLocaleDateString('pt-BR')
        };
        
        // Verificar se já existe um item para este ano
        const indiceExistente = historico.findIndex(item => item.ano === ano);
        if (indiceExistente !== -1) {
            if (confirm('Já existe um cálculo para este ano. Deseja substituir?')) {
                historico[indiceExistente] = novoItem;
            } else {
                return;
            }
        } else {
            historico.push(novoItem);
        }
        
        // Ordenar por ano
        historico.sort((a, b) => b.ano - a.ano);
        
        // Salvar no localStorage
        localStorage.setItem('historico-salarios', JSON.stringify(historico));
        
        // Atualizar tabela
        atualizarTabelaHistorico();
        
        alert('Item adicionado ao histórico com sucesso!');
    }
    
    // Função para atualizar tabela de histórico
    function atualizarTabelaHistorico() {
        historicoTable.innerHTML = '';
        
        historico.forEach((item, index) => {
            const row = historicoTable.insertRow();
            row.innerHTML = `
                <td>${item.ano}</td>
                <td>${formatCurrency(item.salarioMinimo)}</td>
                <td>${formatCurrency(item.vinteSalarios)}</td>
                <td>${formatCurrency(item.valorTerceiros)}</td>
                <td>${formatCurrency(item.valorMaiorMensal)}</td>
                <td>${formatCurrency(item.economiaAnual)}</td>
                <td>
                    <button onclick="removerDoHistorico(${index})" class="btn" style="background: #e74c3c; padding: 0.3rem 0.8rem; font-size: 0.8rem;">
                        Remover
                    </button>
                </td>
            `;
        });
    }
    
    // Função para remover do histórico
    window.removerDoHistorico = function(index) {
        if (confirm('Tem certeza que deseja remover este item do histórico?')) {
            historico.splice(index, 1);
            localStorage.setItem('historico-salarios', JSON.stringify(historico));
            atualizarTabelaHistorico();
        }
    };
    
    // Função para limpar histórico
    function limparHistorico() {
        if (confirm('Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.')) {
            historico = [];
            localStorage.removeItem('historico-salarios');
            atualizarTabelaHistorico();
            alert('Histórico limpo com sucesso!');
        }
    }
    
    // Event listeners
    inputs.forEach(input => {
        input.addEventListener('input', calcular);
        input.addEventListener('change', calcular);
    });
    
    adicionarHistoricoBtn.addEventListener('click', adicionarAoHistorico);
    limparHistoricoBtn.addEventListener('click', limparHistorico);
    
    // Carregar histórico ao inicializar
    atualizarTabelaHistorico();
    
    // Calcular inicialmente
    calcular();
    
    // Preencher valores padrão baseados em dados históricos
    const anoAtual = new Date().getFullYear();
    document.getElementById('ano').value = anoAtual;
    
    // Valores de salário mínimo históricos (aproximados)
    const salariosMinimos = {
        2024: 1412,
        2023: 1320,
        2022: 1212,
        2021: 1100,
        2020: 1045,
        2019: 998,
        2018: 954,
        2017: 937
    };
    
    // Atualizar salário mínimo quando o ano mudar
    document.getElementById('ano').addEventListener('change', function() {
        const anoSelecionado = parseInt(this.value);
        if (salariosMinimos[anoSelecionado]) {
            document.getElementById('salario-minimo').value = salariosMinimos[anoSelecionado];
            calcular();
        }
    });
    
    // Definir salário mínimo inicial
    if (salariosMinimos[anoAtual]) {
        document.getElementById('salario-minimo').value = salariosMinimos[anoAtual];
    }
    
    // Calcular após definir valores iniciais
    setTimeout(calcular, 100);
});

