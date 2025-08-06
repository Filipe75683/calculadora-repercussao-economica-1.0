// JavaScript para Exclusão Crédito ICMS IRPJ
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('exclusao-credito-form');
    const inputs = form.querySelectorAll('input, select');
    
    // Elementos de resultado
    const creditoIcmsEl = document.getElementById('credito-icms');
    const economiaIrpjEl = document.getElementById('economia-irpj');
    const economiaCsllEl = document.getElementById('economia-csll');
    const economiaAdicionalEl = document.getElementById('economia-adicional');
    const economiaTotalEl = document.getElementById('economia-total');
    const percentualCreditoEl = document.getElementById('percentual-credito');
    
    // Elementos da tabela demonstrativa
    const demoBaseIrpjEl = document.getElementById('demo-base-irpj');
    const demoAliqIrpjEl = document.getElementById('demo-aliq-irpj');
    const demoEconomiaIrpjEl = document.getElementById('demo-economia-irpj');
    const demoBaseCsllEl = document.getElementById('demo-base-csll');
    const demoAliqCsllEl = document.getElementById('demo-aliq-csll');
    const demoEconomiaCsllEl = document.getElementById('demo-economia-csll');
    const demoAdicionalRow = document.getElementById('demo-adicional-row');
    const demoBaseAdicionalEl = document.getElementById('demo-base-adicional');
    const demoEconomiaAdicionalTableEl = document.getElementById('demo-economia-adicional-table');
    const demoEconomiaTotalEl = document.getElementById('demo-economia-total');
    
    // Botões
    const gerarAnaliseMensalBtn = document.getElementById('gerar-analise-mensal');
    const projetarAnualBtn = document.getElementById('projetar-anual');
    
    // Função para formatar moeda
    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }
    
    // Função para formatar porcentagem
    function formatPercentage(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value / 100);
    }
    
    // Função para mostrar/ocultar linha do adicional
    function toggleAdicionalRow() {
        const aplicarAdicional = document.getElementById('adicional-irpj').value === 'sim';
        demoAdicionalRow.style.display = aplicarAdicional ? 'table-row' : 'none';
        calcular();
    }
    
    // Função para calcular
    function calcular() {
        const creditoPresumido = parseFloat(document.getElementById('credito-presumido').value) || 0;
        const aliquotaIrpj = parseFloat(document.getElementById('aliquota-irpj').value) || 0;
        const aliquotaCsll = parseFloat(document.getElementById('aliquota-csll').value) || 0;
        const aplicarAdicional = document.getElementById('adicional-irpj').value === 'sim';
        const faturamentoPeriodo = parseFloat(document.getElementById('faturamento-periodo').value) || 0;
        
        if (creditoPresumido === 0) {
            limparResultados();
            return;
        }
        
        // Cálculos de economia
        const economiaIrpj = creditoPresumido * (aliquotaIrpj / 100);
        const economiaCsll = creditoPresumido * (aliquotaCsll / 100);
        
        // Adicional IRPJ (10% sobre o que exceder R$ 240.000,00/ano)
        let economiaAdicional = 0;
        if (aplicarAdicional && faturamentoPeriodo > 240000) {
            const baseAdicional = Math.min(creditoPresumido, faturamentoPeriodo - 240000);
            economiaAdicional = baseAdicional * 0.10; // 10%
        }
        
        const economiaTotal = economiaIrpj + economiaCsll + economiaAdicional;
        const percentualCredito = creditoPresumido > 0 ? (economiaTotal / creditoPresumido) * 100 : 0;
        
        // Atualizar resultados principais
        creditoIcmsEl.textContent = formatCurrency(creditoPresumido);
        economiaIrpjEl.textContent = formatCurrency(economiaIrpj);
        economiaCsllEl.textContent = formatCurrency(economiaCsll);
        economiaAdicionalEl.textContent = formatCurrency(economiaAdicional);
        economiaTotalEl.textContent = formatCurrency(economiaTotal);
        percentualCreditoEl.textContent = formatPercentage(percentualCredito);
        
        // Atualizar tabela demonstrativa
        demoBaseIrpjEl.textContent = formatCurrency(creditoPresumido);
        demoAliqIrpjEl.textContent = formatPercentage(aliquotaIrpj);
        demoEconomiaIrpjEl.textContent = formatCurrency(economiaIrpj);
        demoBaseCsllEl.textContent = formatCurrency(creditoPresumido);
        demoAliqCsllEl.textContent = formatPercentage(aliquotaCsll);
        demoEconomiaCsllEl.textContent = formatCurrency(economiaCsll);
        
        if (aplicarAdicional) {
            const baseAdicional = Math.min(creditoPresumido, Math.max(0, faturamentoPeriodo - 240000));
            demoBaseAdicionalEl.textContent = formatCurrency(baseAdicional);
            demoEconomiaAdicionalTableEl.textContent = formatCurrency(economiaAdicional);
        }
        
        demoEconomiaTotalEl.textContent = formatCurrency(economiaTotal);
    }
    
    // Função para limpar resultados
    function limparResultados() {
        creditoIcmsEl.textContent = formatCurrency(0);
        economiaIrpjEl.textContent = formatCurrency(0);
        economiaCsllEl.textContent = formatCurrency(0);
        economiaAdicionalEl.textContent = formatCurrency(0);
        economiaTotalEl.textContent = formatCurrency(0);
        percentualCreditoEl.textContent = formatPercentage(0);
        
        // Limpar tabela
        demoBaseIrpjEl.textContent = formatCurrency(0);
        demoAliqIrpjEl.textContent = formatPercentage(0);
        demoEconomiaIrpjEl.textContent = formatCurrency(0);
        demoBaseCsllEl.textContent = formatCurrency(0);
        demoAliqCsllEl.textContent = formatPercentage(0);
        demoEconomiaCsllEl.textContent = formatCurrency(0);
        demoBaseAdicionalEl.textContent = formatCurrency(0);
        demoEconomiaAdicionalTableEl.textContent = formatCurrency(0);
        demoEconomiaTotalEl.textContent = formatCurrency(0);
    }
    
    // Função para definir alíquotas padrão
    function definirAliquotasPadrao() {
        const regime = document.getElementById('regime-tributario').value;
        const aliquotaIrpjEl = document.getElementById('aliquota-irpj');
        const aliquotaCsllEl = document.getElementById('aliquota-csll');
        
        switch (regime) {
            case 'lucro-real':
                aliquotaIrpjEl.value = '25.00';
                aliquotaCsllEl.value = '9.00';
                break;
            case 'lucro-presumido':
                aliquotaIrpjEl.value = '15.00';
                aliquotaCsllEl.value = '9.00';
                break;
            default:
                aliquotaIrpjEl.value = '';
                aliquotaCsllEl.value = '';
        }
        
        calcular();
    }
    
    // Função para gerar análise mensal
    function gerarAnaliseMensal() {
        const creditoPresumido = parseFloat(document.getElementById('credito-presumido').value) || 0;
        const aliquotaIrpj = parseFloat(document.getElementById('aliquota-irpj').value) || 0;
        const aliquotaCsll = parseFloat(document.getElementById('aliquota-csll').value) || 0;
        
        if (creditoPresumido === 0) {
            alert('Por favor, informe o crédito presumido para gerar a análise mensal.');
            return;
        }
        
        const analiseMensalTable = document.getElementById('analise-mensal-table').getElementsByTagName('tbody')[0];
        
        // Limpar tabela
        analiseMensalTable.innerHTML = '';
        
        const meses = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        
        const creditoMensal = creditoPresumido / 12;
        const economiaMensalIrpj = creditoMensal * (aliquotaIrpj / 100);
        const economiaMensalCsll = creditoMensal * (aliquotaCsll / 100);
        const totalMensal = economiaMensalIrpj + economiaMensalCsll;
        
        meses.forEach(mes => {
            const row = analiseMensalTable.insertRow();
            row.innerHTML = `
                <td>${mes}</td>
                <td>${formatCurrency(creditoMensal)}</td>
                <td>${formatCurrency(economiaMensalIrpj)}</td>
                <td>${formatCurrency(economiaMensalCsll)}</td>
                <td>${formatCurrency(totalMensal)}</td>
            `;
        });
        
        alert('Análise mensal gerada com sucesso!');
    }
    
    // Função para projetar anual
    function projetarAnual() {
        const creditoPresumido = parseFloat(document.getElementById('credito-presumido').value) || 0;
        const aliquotaIrpj = parseFloat(document.getElementById('aliquota-irpj').value) || 0;
        const aliquotaCsll = parseFloat(document.getElementById('aliquota-csll').value) || 0;
        
        if (creditoPresumido === 0) {
            alert('Por favor, informe o crédito presumido para fazer a projeção.');
            return;
        }
        
        const economiaAnual = creditoPresumido * ((aliquotaIrpj + aliquotaCsll) / 100);
        const projecao5Anos = economiaAnual * 5;
        const valorPresente = projecao5Anos / Math.pow(1.10, 5); // Desconto de 10% a.a.
        
        const projecao = `
PROJEÇÃO ANUAL - EXCLUSÃO CRÉDITO ICMS
======================================

Crédito Presumido Anual: ${formatCurrency(creditoPresumido)}
Economia Anual Estimada: ${formatCurrency(economiaAnual)}

PROJEÇÃO 5 ANOS:
- Economia Total: ${formatCurrency(projecao5Anos)}
- Valor Presente Líquido: ${formatCurrency(valorPresente)}
- Taxa de Desconto: 10% a.a.

BENEFÍCIOS:
- Redução da carga tributária
- Melhoria do fluxo de caixa
- Aumento da competitividade
- Recursos para reinvestimento

RECOMENDAÇÕES:
- Manter controles rigorosos
- Documentar adequadamente
- Acompanhar mudanças legislativas
- Revisar cálculos periodicamente
        `;
        
        alert(projecao);
    }
    
    // Event listeners
    inputs.forEach(input => {
        input.addEventListener('input', calcular);
        input.addEventListener('change', calcular);
    });
    
    // Event listeners específicos
    document.getElementById('adicional-irpj').addEventListener('change', toggleAdicionalRow);
    document.getElementById('regime-tributario').addEventListener('change', definirAliquotasPadrao);
    gerarAnaliseMensalBtn.addEventListener('click', gerarAnaliseMensal);
    projetarAnualBtn.addEventListener('click', projetarAnual);
    
    // Calcular inicialmente
    calcular();
    
    // Validações
    ['credito-presumido', 'faturamento-periodo'].forEach(id => {
        document.getElementById(id).addEventListener('input', function() {
            if (this.value < 0) this.value = 0;
        });
    });
    
    ['aliquota-irpj', 'aliquota-csll'].forEach(id => {
        document.getElementById(id).addEventListener('input', function() {
            if (this.value < 0) this.value = 0;
            if (this.value > 100) this.value = 100;
        });
    });
});

