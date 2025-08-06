// JavaScript para Exclusão ICMS PIS COFINS IPI
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('exclusao-icms-pis-cofins-ipi-form');
    const inputs = form.querySelectorAll('input, select');
    
    // Elementos de resultado
    const valorBaseEl = document.getElementById('valor-base');
    const icmsDestacadoEl = document.getElementById('icms-destacado');
    const pisDestacadoEl = document.getElementById('pis-destacado');
    const cofinsDestacadoEl = document.getElementById('cofins-destacado');
    const baseIpiComEl = document.getElementById('base-ipi-com');
    const baseIpiSemEl = document.getElementById('base-ipi-sem');
    const ipiAtualEl = document.getElementById('ipi-atual');
    const ipiReduzidoEl = document.getElementById('ipi-reduzido');
    const economiaTotalEl = document.getElementById('economia-total');
    const percentualEconomiaEl = document.getElementById('percentual-economia');
    
    // Elementos da tabela comparativa
    const compBaseAtualEl = document.getElementById('comp-base-atual');
    const compIpiAtualEl = document.getElementById('comp-ipi-atual');
    const compBaseSemIcmsEl = document.getElementById('comp-base-sem-icms');
    const compIpiSemIcmsEl = document.getElementById('comp-ipi-sem-icms');
    const compEconomiaIcmsEl = document.getElementById('comp-economia-icms');
    const compPercIcmsEl = document.getElementById('comp-perc-icms');
    const compBaseSemPisCofinsEl = document.getElementById('comp-base-sem-pis-cofins');
    const compIpiSemPisCofinsEl = document.getElementById('comp-ipi-sem-pis-cofins');
    const compEconomiaPisCofinsEl = document.getElementById('comp-economia-pis-cofins');
    const compPercPisCofinsEl = document.getElementById('comp-perc-pis-cofins');
    const compBaseSemTodosEl = document.getElementById('comp-base-sem-todos');
    const compIpiSemTodosEl = document.getElementById('comp-ipi-sem-todos');
    const compEconomiaTotalEl = document.getElementById('comp-economia-total');
    const compPercTotalEl = document.getElementById('comp-perc-total');
    
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
    
    // Função para calcular
    function calcular() {
        const valorProduto = parseFloat(document.getElementById('valor-produto').value) || 0;
        const aliquotaIcms = parseFloat(document.getElementById('aliquota-icms').value) || 0;
        const aliquotaPis = parseFloat(document.getElementById('aliquota-pis').value) || 0;
        const aliquotaCofins = parseFloat(document.getElementById('aliquota-cofins').value) || 0;
        const aliquotaIpi = parseFloat(document.getElementById('aliquota-ipi').value) || 0;
        const aplicarExclusao = document.getElementById('aplicar-exclusao').value;
        
        if (valorProduto === 0 || aliquotaIpi === 0) {
            limparResultados();
            return;
        }
        
        // Calcular impostos destacados
        const icmsDestacado = valorProduto * (aliquotaIcms / 100);
        const pisDestacado = valorProduto * (aliquotaPis / 100);
        const cofinsDestacado = valorProduto * (aliquotaCofins / 100);
        
        // Valor base (sem impostos)
        const valorBase = valorProduto - icmsDestacado - pisDestacado - cofinsDestacado;
        
        // Base de cálculo do IPI conforme cenário
        let baseIpiCom = valorProduto; // Base atual (com todos os impostos)
        let baseIpiSem = valorProduto; // Base reduzida
        
        switch (aplicarExclusao) {
            case 'icms':
                baseIpiSem = valorProduto - icmsDestacado;
                break;
            case 'pis-cofins':
                baseIpiSem = valorProduto - pisDestacado - cofinsDestacado;
                break;
            case 'todos':
                baseIpiSem = valorBase;
                break;
            case 'nenhum':
            default:
                baseIpiSem = valorProduto;
                break;
        }
        
        // Calcular IPI
        const ipiAtual = baseIpiCom * (aliquotaIpi / 100);
        const ipiReduzido = baseIpiSem * (aliquotaIpi / 100);
        const economiaTotal = ipiAtual - ipiReduzido;
        const percentualEconomia = ipiAtual > 0 ? (economiaTotal / ipiAtual) * 100 : 0;
        
        // Atualizar resultados principais
        valorBaseEl.textContent = formatCurrency(valorBase);
        icmsDestacadoEl.textContent = formatCurrency(icmsDestacado);
        pisDestacadoEl.textContent = formatCurrency(pisDestacado);
        cofinsDestacadoEl.textContent = formatCurrency(cofinsDestacado);
        baseIpiComEl.textContent = formatCurrency(baseIpiCom);
        baseIpiSemEl.textContent = formatCurrency(baseIpiSem);
        ipiAtualEl.textContent = formatCurrency(ipiAtual);
        ipiReduzidoEl.textContent = formatCurrency(ipiReduzido);
        economiaTotalEl.textContent = formatCurrency(economiaTotal);
        percentualEconomiaEl.textContent = formatPercentage(percentualEconomia);
        
        // Calcular cenários para tabela comparativa
        const baseSemIcms = valorProduto - icmsDestacado;
        const ipiSemIcms = baseSemIcms * (aliquotaIpi / 100);
        const economiaIcms = ipiAtual - ipiSemIcms;
        const percIcms = ipiAtual > 0 ? (economiaIcms / ipiAtual) * 100 : 0;
        
        const baseSemPisCofins = valorProduto - pisDestacado - cofinsDestacado;
        const ipiSemPisCofins = baseSemPisCofins * (aliquotaIpi / 100);
        const economiaPisCofins = ipiAtual - ipiSemPisCofins;
        const percPisCofins = ipiAtual > 0 ? (economiaPisCofins / ipiAtual) * 100 : 0;
        
        const baseSemTodos = valorBase;
        const ipiSemTodos = baseSemTodos * (aliquotaIpi / 100);
        const economiaTodos = ipiAtual - ipiSemTodos;
        const percTodos = ipiAtual > 0 ? (economiaTodos / ipiAtual) * 100 : 0;
        
        // Atualizar tabela comparativa
        compBaseAtualEl.textContent = formatCurrency(baseIpiCom);
        compIpiAtualEl.textContent = formatCurrency(ipiAtual);
        
        compBaseSemIcmsEl.textContent = formatCurrency(baseSemIcms);
        compIpiSemIcmsEl.textContent = formatCurrency(ipiSemIcms);
        compEconomiaIcmsEl.textContent = formatCurrency(economiaIcms);
        compPercIcmsEl.textContent = formatPercentage(percIcms);
        
        compBaseSemPisCofinsEl.textContent = formatCurrency(baseSemPisCofins);
        compIpiSemPisCofinsEl.textContent = formatCurrency(ipiSemPisCofins);
        compEconomiaPisCofinsEl.textContent = formatCurrency(economiaPisCofins);
        compPercPisCofinsEl.textContent = formatPercentage(percPisCofins);
        
        compBaseSemTodosEl.textContent = formatCurrency(baseSemTodos);
        compIpiSemTodosEl.textContent = formatCurrency(ipiSemTodos);
        compEconomiaTotalEl.textContent = formatCurrency(economiaTodos);
        compPercTotalEl.textContent = formatPercentage(percTodos);
    }
    
    // Função para limpar resultados
    function limparResultados() {
        valorBaseEl.textContent = formatCurrency(0);
        icmsDestacadoEl.textContent = formatCurrency(0);
        pisDestacadoEl.textContent = formatCurrency(0);
        cofinsDestacadoEl.textContent = formatCurrency(0);
        baseIpiComEl.textContent = formatCurrency(0);
        baseIpiSemEl.textContent = formatCurrency(0);
        ipiAtualEl.textContent = formatCurrency(0);
        ipiReduzidoEl.textContent = formatCurrency(0);
        economiaTotalEl.textContent = formatCurrency(0);
        percentualEconomiaEl.textContent = formatPercentage(0);
        
        // Limpar tabela comparativa
        [compBaseAtualEl, compIpiAtualEl, compBaseSemIcmsEl, compIpiSemIcmsEl,
         compEconomiaIcmsEl, compPercIcmsEl, compBaseSemPisCofinsEl, compIpiSemPisCofinsEl,
         compEconomiaPisCofinsEl, compPercPisCofinsEl, compBaseSemTodosEl, compIpiSemTodosEl,
         compEconomiaTotalEl, compPercTotalEl].forEach(el => {
            if (el.textContent !== undefined) {
                el.textContent = el.id.includes('perc') ? formatPercentage(0) : formatCurrency(0);
            }
        });
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
        }
        
        calcular();
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
    document.getElementById('valor-produto').addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
    });
    
    ['aliquota-icms', 'aliquota-pis', 'aliquota-cofins', 'aliquota-ipi'].forEach(id => {
        document.getElementById(id).addEventListener('input', function() {
            if (this.value < 0) this.value = 0;
            if (this.value > 100) this.value = 100;
        });
    });
    
    // Função para exportar análise
    window.exportarAnalise = function() {
        const valorProduto = parseFloat(document.getElementById('valor-produto').value) || 0;
        const aliquotaIpi = parseFloat(document.getElementById('aliquota-ipi').value) || 0;
        const economiaTotal = parseFloat(economiaTotalEl.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        const percentualEconomia = parseFloat(percentualEconomiaEl.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        
        const analise = `
ANÁLISE DE EXCLUSÃO - ICMS, PIS E COFINS DA BASE DO IPI
======================================================

Data: ${new Date().toLocaleDateString('pt-BR')}
Valor do Produto: ${formatCurrency(valorProduto)}
Alíquota IPI: ${aliquotaIpi}%

RESULTADOS:
- Economia Total: ${formatCurrency(economiaTotal)}
- Percentual de Economia: ${percentualEconomia.toFixed(2)}%

FUNDAMENTAÇÃO LEGAL:
- STF - RE 566.819 (Exclusão do ICMS)
- STJ - Tema 69 (Exclusão do PIS e COFINS)
- Princípio da não cumulatividade

RECOMENDAÇÕES:
- Implementar controles específicos
- Documentar adequadamente as operações
- Acompanhar mudanças jurisprudenciais
- Considerar aplicação retroativa

OBSERVAÇÃO: Esta análise é baseada em entendimento jurisprudencial.
Recomenda-se acompanhamento jurídico especializado.
        `;
        
        const blob = new Blob([analise], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analise-exclusao-ipi-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    // Adicionar botão de exportação se não existir
    if (!document.getElementById('acoes-exclusao')) {
        const acoesDiv = document.createElement('div');
        acoesDiv.id = 'acoes-exclusao';
        acoesDiv.className = 'text-center mt-2';
        acoesDiv.innerHTML = `
            <button onclick="exportarAnalise()" class="btn">Exportar Análise</button>
        `;
        
        const container = document.querySelector('.container');
        if (container) {
            container.appendChild(acoesDiv);
        }
    }
});

