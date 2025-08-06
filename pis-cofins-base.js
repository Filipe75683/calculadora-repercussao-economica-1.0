// JavaScript para cálculo de PIS e COFINS própria base
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('pis-cofins-form');
    const inputs = form.querySelectorAll('input, select');
    
    // Elementos de resultado
    const baseCalculoEl = document.getElementById('base-calculo');
    const pisDevidoEl = document.getElementById('pis-devido');
    const cofinsDevidoEl = document.getElementById('cofins-devido');
    const totalPisCofinsEl = document.getElementById('total-pis-cofins');
    const valorLiquidoEl = document.getElementById('valor-liquido');
    const aliquotaEfetivaEl = document.getElementById('aliquota-efetiva');
    const regimeInfoEl = document.getElementById('regime-info');
    const periodoInfoEl = document.getElementById('periodo-info');
    
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
        const faturamentoBruto = parseFloat(document.getElementById('faturamento-bruto').value) || 0;
        const regime = document.getElementById('regime-tributario').value;
        const aliquotaPis = parseFloat(document.getElementById('aliquota-pis').value) || 0;
        const aliquotaCofins = parseFloat(document.getElementById('aliquota-cofins').value) || 0;
        const deducoes = parseFloat(document.getElementById('deducoes').value) || 0;
        const creditos = parseFloat(document.getElementById('creditos').value) || 0;
        const periodo = document.getElementById('periodo-calculo').value;
        
        if (faturamentoBruto === 0) {
            // Limpar resultados se não há dados suficientes
            baseCalculoEl.textContent = formatCurrency(0);
            pisDevidoEl.textContent = formatCurrency(0);
            cofinsDevidoEl.textContent = formatCurrency(0);
            totalPisCofinsEl.textContent = formatCurrency(0);
            valorLiquidoEl.textContent = formatCurrency(0);
            aliquotaEfetivaEl.textContent = formatPercentage(0);
            return;
        }
        
        // Cálculos
        const baseCalculo = Math.max(0, faturamentoBruto - deducoes);
        const pisDevido = baseCalculo * (aliquotaPis / 100);
        const cofinsDevido = baseCalculo * (aliquotaCofins / 100);
        const totalPisCofins = pisDevido + cofinsDevido;
        const valorLiquido = Math.max(0, totalPisCofins - creditos);
        const aliquotaEfetiva = faturamentoBruto > 0 ? (totalPisCofins / faturamentoBruto) * 100 : 0;
        
        // Atualizar resultados
        baseCalculoEl.textContent = formatCurrency(baseCalculo);
        pisDevidoEl.textContent = formatCurrency(pisDevido);
        cofinsDevidoEl.textContent = formatCurrency(cofinsDevido);
        totalPisCofinsEl.textContent = formatCurrency(totalPisCofins);
        valorLiquidoEl.textContent = formatCurrency(valorLiquido);
        aliquotaEfetivaEl.textContent = formatPercentage(aliquotaEfetiva);
        
        // Atualizar informações adicionais
        const regimeNomes = {
            'lucro-real': 'Lucro Real',
            'lucro-presumido': 'Lucro Presumido',
            'simples': 'Simples Nacional'
        };
        
        const periodoNomes = {
            'mensal': 'Mensal',
            'trimestral': 'Trimestral',
            'anual': 'Anual'
        };
        
        regimeInfoEl.textContent = regimeNomes[regime] || '-';
        periodoInfoEl.textContent = periodoNomes[periodo] || '-';
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
    
    // Adicionar validações
    document.getElementById('faturamento-bruto').addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
    });
    
    document.getElementById('aliquota-pis').addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
        if (this.value > 100) this.value = 100;
    });
    
    document.getElementById('aliquota-cofins').addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
        if (this.value > 100) this.value = 100;
    });
    
    document.getElementById('deducoes').addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
    });
    
    document.getElementById('creditos').addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
    });
    
    // Função para exportar resultados
    window.exportarResultados = function() {
        const faturamentoBruto = parseFloat(document.getElementById('faturamento-bruto').value) || 0;
        const regime = document.getElementById('regime-tributario').value;
        const baseCalculo = parseFloat(baseCalculoEl.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        const pisDevido = parseFloat(pisDevidoEl.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        const cofinsDevido = parseFloat(cofinsDevidoEl.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        
        const dados = {
            data: new Date().toLocaleDateString('pt-BR'),
            faturamentoBruto: faturamentoBruto,
            regime: regime,
            baseCalculo: baseCalculo,
            pisDevido: pisDevido,
            cofinsDevido: cofinsDevido,
            total: pisDevido + cofinsDevido
        };
        
        const json = JSON.stringify(dados, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pis-cofins-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    // Adicionar botão de exportar (se não existir)
    if (!document.getElementById('exportar-btn')) {
        const exportarBtn = document.createElement('button');
        exportarBtn.id = 'exportar-btn';
        exportarBtn.className = 'btn';
        exportarBtn.textContent = 'Exportar Resultados';
        exportarBtn.style.marginLeft = '1rem';
        exportarBtn.onclick = window.exportarResultados;
        
        const resultsSection = document.querySelector('.results-section');
        if (resultsSection) {
            resultsSection.appendChild(exportarBtn);
        }
    }
});

