// JavaScript para cálculo de ISS da BC PIS e COFINS
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('iss-pis-cofins-form');
    const inputs = form.querySelectorAll('input, select');
    
    // Elementos de resultado
    const baseIssEl = document.getElementById('base-iss');
    const faturamentoSemIssEl = document.getElementById('faturamento-sem-iss');
    const pisBaseOriginalEl = document.getElementById('pis-base-original');
    const cofinsBaseOriginalEl = document.getElementById('cofins-base-original');
    const pisSemIssEl = document.getElementById('pis-sem-iss');
    const cofinsSemIssEl = document.getElementById('cofins-sem-iss');
    const economiaTotalEl = document.getElementById('economia-total');
    const percentualEconomiaEl = document.getElementById('percentual-economia');
    
    // Elementos da tabela comparativa
    const cenarioComBaseEl = document.getElementById('cenario-com-base');
    const cenarioComPisEl = document.getElementById('cenario-com-pis');
    const cenarioComCofinsEl = document.getElementById('cenario-com-cofins');
    const cenarioComTotalEl = document.getElementById('cenario-com-total');
    
    const cenarioSemBaseEl = document.getElementById('cenario-sem-base');
    const cenarioSemPisEl = document.getElementById('cenario-sem-pis');
    const cenarioSemCofinsEl = document.getElementById('cenario-sem-cofins');
    const cenarioSemTotalEl = document.getElementById('cenario-sem-total');
    
    const economiaBaseEl = document.getElementById('economia-base');
    const economiaPisEl = document.getElementById('economia-pis');
    const economiaCofinsEl = document.getElementById('economia-cofins');
    const economiaTotalTableEl = document.getElementById('economia-total-table');
    
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
    
    // Função para definir alíquotas padrão baseadas no regime
    function definirAliquotasPadrao() {
        const regime = document.getElementById('regime-tributario').value;
        const aliquotaPisEl = document.getElementById('aliquota-pis');
        const aliquotaCofinsEl = document.getElementById('aliquota-cofins');
        
        switch (regime) {
            case 'lucro-real':
                aliquotaPisEl.value = '1.65';
                aliquotaCofinsEl.value = '7.60';
                break;
            case 'lucro-presumido':
                aliquotaPisEl.value = '0.65';
                aliquotaCofinsEl.value = '3.00';
                break;
            case 'simples':
                aliquotaPisEl.value = '0.00';
                aliquotaCofinsEl.value = '0.00';
                break;
            default:
                aliquotaPisEl.value = '';
                aliquotaCofinsEl.value = '';
        }
        
        calcular();
    }
    
    // Função para calcular
    function calcular() {
        const faturamentoTotal = parseFloat(document.getElementById('faturamento-total').value) || 0;
        const issRecolhido = parseFloat(document.getElementById('iss-recolhido').value) || 0;
        const aliquotaIss = parseFloat(document.getElementById('aliquota-iss').value) || 0;
        const aliquotaPis = parseFloat(document.getElementById('aliquota-pis').value) || 0;
        const aliquotaCofins = parseFloat(document.getElementById('aliquota-cofins').value) || 0;
        
        if (faturamentoTotal === 0) {
            limparResultados();
            return;
        }
        
        // Cálculos
        // Base de cálculo do ISS (estimada a partir do ISS recolhido)
        let baseIss = 0;
        if (issRecolhido > 0 && aliquotaIss > 0) {
            baseIss = issRecolhido / (aliquotaIss / 100);
        } else if (aliquotaIss > 0) {
            // Estimar base do ISS como parte do faturamento
            baseIss = faturamentoTotal * 0.8; // Estimativa conservadora
        }
        
        // Faturamento sem ISS
        const faturamentoSemIss = faturamentoTotal - issRecolhido;
        
        // PIS e COFINS sobre base original (com ISS)
        const pisBaseOriginal = faturamentoTotal * (aliquotaPis / 100);
        const cofinsBaseOriginal = faturamentoTotal * (aliquotaCofins / 100);
        
        // PIS e COFINS sobre base sem ISS
        const pisSemIss = faturamentoSemIss * (aliquotaPis / 100);
        const cofinsSemIss = faturamentoSemIss * (aliquotaCofins / 100);
        
        // Economia total
        const economiaPis = pisBaseOriginal - pisSemIss;
        const economiaCofins = cofinsBaseOriginal - cofinsSemIss;
        const economiaTotal = economiaPis + economiaCofins;
        
        // Percentual de economia
        const totalOriginal = pisBaseOriginal + cofinsBaseOriginal;
        const percentualEconomia = totalOriginal > 0 ? (economiaTotal / totalOriginal) * 100 : 0;
        
        // Atualizar resultados principais
        baseIssEl.textContent = formatCurrency(baseIss);
        faturamentoSemIssEl.textContent = formatCurrency(faturamentoSemIss);
        pisBaseOriginalEl.textContent = formatCurrency(pisBaseOriginal);
        cofinsBaseOriginalEl.textContent = formatCurrency(cofinsBaseOriginal);
        pisSemIssEl.textContent = formatCurrency(pisSemIss);
        cofinsSemIssEl.textContent = formatCurrency(cofinsSemIss);
        economiaTotalEl.textContent = formatCurrency(economiaTotal);
        percentualEconomiaEl.textContent = formatPercentage(percentualEconomia);
        
        // Atualizar tabela comparativa
        cenarioComBaseEl.textContent = formatCurrency(faturamentoTotal);
        cenarioComPisEl.textContent = formatCurrency(pisBaseOriginal);
        cenarioComCofinsEl.textContent = formatCurrency(cofinsBaseOriginal);
        cenarioComTotalEl.textContent = formatCurrency(totalOriginal);
        
        cenarioSemBaseEl.textContent = formatCurrency(faturamentoSemIss);
        cenarioSemPisEl.textContent = formatCurrency(pisSemIss);
        cenarioSemCofinsEl.textContent = formatCurrency(cofinsSemIss);
        cenarioSemTotalEl.textContent = formatCurrency(pisSemIss + cofinsSemIss);
        
        economiaBaseEl.textContent = formatCurrency(issRecolhido);
        economiaPisEl.textContent = formatCurrency(economiaPis);
        economiaCofinsEl.textContent = formatCurrency(economiaCofins);
        economiaTotalTableEl.textContent = formatCurrency(economiaTotal);
    }
    
    // Função para limpar resultados
    function limparResultados() {
        baseIssEl.textContent = formatCurrency(0);
        faturamentoSemIssEl.textContent = formatCurrency(0);
        pisBaseOriginalEl.textContent = formatCurrency(0);
        cofinsBaseOriginalEl.textContent = formatCurrency(0);
        pisSemIssEl.textContent = formatCurrency(0);
        cofinsSemIssEl.textContent = formatCurrency(0);
        economiaTotalEl.textContent = formatCurrency(0);
        percentualEconomiaEl.textContent = formatPercentage(0);
        
        // Limpar tabela
        [cenarioComBaseEl, cenarioComPisEl, cenarioComCofinsEl, cenarioComTotalEl,
         cenarioSemBaseEl, cenarioSemPisEl, cenarioSemCofinsEl, cenarioSemTotalEl,
         economiaBaseEl, economiaPisEl, economiaCofinsEl, economiaTotalTableEl].forEach(el => {
            el.textContent = formatCurrency(0);
        });
    }
    
    // Event listeners
    inputs.forEach(input => {
        input.addEventListener('input', calcular);
        input.addEventListener('change', calcular);
    });
    
    // Event listener específico para mudança de regime
    document.getElementById('regime-tributario').addEventListener('change', definirAliquotasPadrao);
    
    // Calcular inicialmente
    calcular();
    
    // Validações
    ['faturamento-total', 'iss-recolhido'].forEach(id => {
        document.getElementById(id).addEventListener('input', function() {
            if (this.value < 0) this.value = 0;
        });
    });
    
    ['aliquota-iss', 'aliquota-pis', 'aliquota-cofins'].forEach(id => {
        document.getElementById(id).addEventListener('input', function() {
            if (this.value < 0) this.value = 0;
            if (this.value > 100) this.value = 100;
        });
    });
});

