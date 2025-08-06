// JavaScript para cálculo de Gross Up
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('gross-up-form');
    const inputs = form.querySelectorAll('input, select');
    
    // Elementos de resultado
    const valorBrutoEl = document.getElementById('valor-bruto');
    const icmsCalculadoEl = document.getElementById('icms-calculado');
    const pisCalculadoEl = document.getElementById('pis-calculado');
    const cofinsCalculadoEl = document.getElementById('cofins-calculado');
    const totalImpostosEl = document.getElementById('total-impostos');
    const valorLiquidoResultanteEl = document.getElementById('valor-liquido-resultante');
    const diferencaCalculoEl = document.getElementById('diferenca-calculo');
    
    // Elementos da tabela demonstrativa
    const demoBrutoBrutoEl = document.getElementById('demo-base-bruto');
    const demoValorBrutoEl = document.getElementById('demo-valor-bruto');
    const demoBaseIcmsEl = document.getElementById('demo-base-icms');
    const demoAliqIcmsEl = document.getElementById('demo-aliq-icms');
    const demoValorIcmsEl = document.getElementById('demo-valor-icms');
    const demoBasePisEl = document.getElementById('demo-base-pis');
    const demoAliqPisEl = document.getElementById('demo-aliq-pis');
    const demoValorPisEl = document.getElementById('demo-valor-pis');
    const demoBaseCofinsEl = document.getElementById('demo-base-cofins');
    const demoAliqCofinsEl = document.getElementById('demo-aliq-cofins');
    const demoValorCofinsEl = document.getElementById('demo-valor-cofins');
    const demoValorLiquidoEl = document.getElementById('demo-valor-liquido');
    
    // Elementos IPI (opcionais)
    const ipiSection = document.getElementById('ipi-section');
    const demoIpiRow = document.getElementById('demo-ipi-row');
    const demoBaseIpiEl = document.getElementById('demo-base-ipi-calc');
    const demoAliqIpiEl = document.getElementById('demo-aliq-ipi');
    const demoValorIpiEl = document.getElementById('demo-valor-ipi');
    
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
    
    // Função para mostrar/ocultar seção IPI
    function toggleIpiSection() {
        const incluirIpi = document.getElementById('incluir-ipi').value === 'sim';
        ipiSection.style.display = incluirIpi ? 'flex' : 'none';
        demoIpiRow.style.display = incluirIpi ? 'table-row' : 'none';
        calcular();
    }
    
    // Função para calcular
    function calcular() {
        const icmsIncidente = parseFloat(document.getElementById('icms-incidente').value) || 0;
        const aliquotaPisCofins = parseFloat(document.getElementById('aliquota-pis-cofins').value) || 0;
        const valorLiquidoDesejado = parseFloat(document.getElementById('valor-liquido-desejado').value) || 0;
        const aliquotaIcms = parseFloat(document.getElementById('aliquota-icms').value) || 0;
        const aliquotaPis = parseFloat(document.getElementById('aliquota-pis').value) || 0;
        const aliquotaCofins = parseFloat(document.getElementById('aliquota-cofins').value) || 0;
        const tipoCalculo = document.getElementById('tipo-calculo').value;
        const incluirIpi = document.getElementById('incluir-ipi').value === 'sim';
        
        let aliquotaIpi = 0;
        let baseIpi = 0;
        
        if (incluirIpi) {
            aliquotaIpi = parseFloat(document.getElementById('aliquota-ipi').value) || 0;
            baseIpi = parseFloat(document.getElementById('base-ipi').value) || 0;
        }
        
        // Limpar resultados se não há dados suficientes
        if ((valorLiquidoDesejado === 0 && icmsIncidente === 0) || 
            (aliquotaIcms === 0 && aliquotaPis === 0 && aliquotaCofins === 0)) {
            limparResultados();
            return;
        }
        
        let valorBruto = 0;
        let icmsCalculado = 0;
        let pisCalculado = 0;
        let cofinsCalculado = 0;
        let ipiCalculado = 0;
        
        switch (tipoCalculo) {
            case 'gross-up-simples':
                // Gross Up Simples: Valor Bruto = Valor Líquido / (1 - Alíquota Total)
                const aliquotaTotal = aliquotaIcms + aliquotaPis + aliquotaCofins + (incluirIpi ? aliquotaIpi : 0);
                if (aliquotaTotal >= 100) {
                    alert('A soma das alíquotas não pode ser igual ou superior a 100%');
                    return;
                }
                valorBruto = valorLiquidoDesejado / (1 - (aliquotaTotal / 100));
                break;
                
            case 'gross-up-composto':
                // Gross Up Composto: considera bases diferentes para cada imposto
                if (valorLiquidoDesejado > 0) {
                    // Cálculo iterativo para encontrar o valor bruto
                    valorBruto = valorLiquidoDesejado;
                    for (let i = 0; i < 10; i++) { // máximo 10 iterações
                        const baseIcmsCalc = valorBruto;
                        const basePisCalc = valorBruto;
                        const baseCofinsCalc = valorBruto;
                        
                        icmsCalculado = baseIcmsCalc * (aliquotaIcms / 100);
                        pisCalculado = basePisCalc * (aliquotaPis / 100);
                        cofinsCalculado = baseCofinsCalc * (aliquotaCofins / 100);
                        
                        if (incluirIpi && baseIpi > 0) {
                            ipiCalculado = baseIpi * (aliquotaIpi / 100);
                        }
                        
                        const totalImpostos = icmsCalculado + pisCalculado + cofinsCalculado + ipiCalculado;
                        const valorLiquidoCalculado = valorBruto - totalImpostos;
                        
                        if (Math.abs(valorLiquidoCalculado - valorLiquidoDesejado) < 0.01) {
                            break;
                        }
                        
                        // Ajustar valor bruto para próxima iteração
                        valorBruto = valorBruto * (valorLiquidoDesejado / valorLiquidoCalculado);
                    }
                }
                break;
                
            case 'calculo-reverso':
                // Cálculo Reverso: partir do ICMS incidente para encontrar o bruto
                if (icmsIncidente > 0 && aliquotaIcms > 0) {
                    valorBruto = icmsIncidente / (aliquotaIcms / 100);
                }
                break;
        }
        
        // Recalcular impostos com o valor bruto final
        if (tipoCalculo !== 'gross-up-composto') {
            icmsCalculado = valorBruto * (aliquotaIcms / 100);
            pisCalculado = valorBruto * (aliquotaPis / 100);
            cofinsCalculado = valorBruto * (aliquotaCofins / 100);
            
            if (incluirIpi && baseIpi > 0) {
                ipiCalculado = baseIpi * (aliquotaIpi / 100);
            } else if (incluirIpi) {
                ipiCalculado = valorBruto * (aliquotaIpi / 100);
            }
        }
        
        const totalImpostos = icmsCalculado + pisCalculado + cofinsCalculado + ipiCalculado;
        const valorLiquidoResultante = valorBruto - totalImpostos;
        const diferenca = valorBruto - totalImpostos;
        
        // Atualizar resultados principais
        valorBrutoEl.textContent = formatCurrency(valorBruto);
        icmsCalculadoEl.textContent = formatCurrency(icmsCalculado);
        pisCalculadoEl.textContent = formatCurrency(pisCalculado);
        cofinsCalculadoEl.textContent = formatCurrency(cofinsCalculado);
        totalImpostosEl.textContent = formatCurrency(totalImpostos);
        valorLiquidoResultanteEl.textContent = formatCurrency(valorLiquidoResultante);
        diferencaCalculoEl.textContent = formatCurrency(diferenca);
        
        // Atualizar tabela demonstrativa
        demoBrutoBrutoEl.textContent = formatCurrency(valorBruto);
        demoValorBrutoEl.textContent = formatCurrency(valorBruto);
        demoBaseIcmsEl.textContent = formatCurrency(valorBruto);
        demoAliqIcmsEl.textContent = formatPercentage(aliquotaIcms);
        demoValorIcmsEl.textContent = formatCurrency(icmsCalculado);
        demoBasePisEl.textContent = formatCurrency(valorBruto);
        demoAliqPisEl.textContent = formatPercentage(aliquotaPis);
        demoValorPisEl.textContent = formatCurrency(pisCalculado);
        demoBaseCofinsEl.textContent = formatCurrency(valorBruto);
        demoAliqCofinsEl.textContent = formatPercentage(aliquotaCofins);
        demoValorCofinsEl.textContent = formatCurrency(cofinsCalculado);
        demoValorLiquidoEl.textContent = formatCurrency(valorLiquidoResultante);
        
        if (incluirIpi) {
            const baseIpiCalc = baseIpi > 0 ? baseIpi : valorBruto;
            demoBaseIpiEl.textContent = formatCurrency(baseIpiCalc);
            demoAliqIpiEl.textContent = formatPercentage(aliquotaIpi);
            demoValorIpiEl.textContent = formatCurrency(ipiCalculado);
        }
    }
    
    // Função para limpar resultados
    function limparResultados() {
        valorBrutoEl.textContent = formatCurrency(0);
        icmsCalculadoEl.textContent = formatCurrency(0);
        pisCalculadoEl.textContent = formatCurrency(0);
        cofinsCalculadoEl.textContent = formatCurrency(0);
        totalImpostosEl.textContent = formatCurrency(0);
        valorLiquidoResultanteEl.textContent = formatCurrency(0);
        diferencaCalculoEl.textContent = formatCurrency(0);
        
        // Limpar tabela demonstrativa
        demoBrutoBrutoEl.textContent = formatCurrency(0);
        demoValorBrutoEl.textContent = formatCurrency(0);
        demoBaseIcmsEl.textContent = formatCurrency(0);
        demoAliqIcmsEl.textContent = formatPercentage(0);
        demoValorIcmsEl.textContent = formatCurrency(0);
        demoBasePisEl.textContent = formatCurrency(0);
        demoAliqPisEl.textContent = formatPercentage(0);
        demoValorPisEl.textContent = formatCurrency(0);
        demoBaseCofinsEl.textContent = formatCurrency(0);
        demoAliqCofinsEl.textContent = formatPercentage(0);
        demoValorCofinsEl.textContent = formatCurrency(0);
        demoValorLiquidoEl.textContent = formatCurrency(0);
        
        if (demoBaseIpiEl) {
            demoBaseIpiEl.textContent = formatCurrency(0);
            demoAliqIpiEl.textContent = formatPercentage(0);
            demoValorIpiEl.textContent = formatCurrency(0);
        }
    }
    
    // Event listeners
    inputs.forEach(input => {
        input.addEventListener('input', calcular);
        input.addEventListener('change', calcular);
    });
    
    // Event listener específico para IPI
    document.getElementById('incluir-ipi').addEventListener('change', toggleIpiSection);
    
    // Calcular inicialmente
    calcular();
    
    // Validações
    document.getElementById('icms-incidente').addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
    });
    
    document.getElementById('valor-liquido-desejado').addEventListener('input', function() {
        if (this.value < 0) this.value = 0;
    });
    
    ['aliquota-icms', 'aliquota-pis', 'aliquota-cofins', 'aliquota-pis-cofins', 'aliquota-ipi'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', function() {
                if (this.value < 0) this.value = 0;
                if (this.value > 100) this.value = 100;
            });
        }
    });
    
    // Função para calcular PIS + COFINS automaticamente
    document.getElementById('aliquota-pis').addEventListener('input', atualizarPisCofins);
    document.getElementById('aliquota-cofins').addEventListener('input', atualizarPisCofins);
    
    function atualizarPisCofins() {
        const pis = parseFloat(document.getElementById('aliquota-pis').value) || 0;
        const cofins = parseFloat(document.getElementById('aliquota-cofins').value) || 0;
        document.getElementById('aliquota-pis-cofins').value = (pis + cofins).toFixed(2);
        calcular();
    }
    
    // Função para exportar cálculo
    window.exportarCalculo = function() {
        const dados = {
            data: new Date().toLocaleDateString('pt-BR'),
            entrada: {
                icmsIncidente: parseFloat(document.getElementById('icms-incidente').value) || 0,
                aliquotaPisCofins: parseFloat(document.getElementById('aliquota-pis-cofins').value) || 0,
                valorLiquidoDesejado: parseFloat(document.getElementById('valor-liquido-desejado').value) || 0,
                aliquotaIcms: parseFloat(document.getElementById('aliquota-icms').value) || 0,
                aliquotaPis: parseFloat(document.getElementById('aliquota-pis').value) || 0,
                aliquotaCofins: parseFloat(document.getElementById('aliquota-cofins').value) || 0,
                tipoCalculo: document.getElementById('tipo-calculo').value,
                incluirIpi: document.getElementById('incluir-ipi').value
            },
            resultados: {
                valorBruto: parseFloat(valorBrutoEl.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
                icmsCalculado: parseFloat(icmsCalculadoEl.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
                pisCalculado: parseFloat(pisCalculadoEl.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
                cofinsCalculado: parseFloat(cofinsCalculadoEl.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
                totalImpostos: parseFloat(totalImpostosEl.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0,
                valorLiquidoResultante: parseFloat(valorLiquidoResultanteEl.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0
            }
        };
        
        const json = JSON.stringify(dados, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gross-up-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    // Função para gerar relatório detalhado
    window.gerarRelatorioDetalhado = function() {
        const tipoCalculo = document.getElementById('tipo-calculo').value;
        const valorBruto = parseFloat(valorBrutoEl.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        const valorLiquido = parseFloat(valorLiquidoResultanteEl.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        const totalImpostos = parseFloat(totalImpostosEl.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        
        const tiposNomes = {
            'gross-up-simples': 'Gross Up Simples',
            'gross-up-composto': 'Gross Up Composto',
            'calculo-reverso': 'Cálculo Reverso'
        };
        
        const relatorio = `
RELATÓRIO DETALHADO - GROSS UP
Data: ${new Date().toLocaleDateString('pt-BR')}
Tipo de Cálculo: ${tiposNomes[tipoCalculo] || tipoCalculo}

RESUMO EXECUTIVO:
- Valor Bruto Necessário: ${formatCurrency(valorBruto)}
- Total de Impostos: ${formatCurrency(totalImpostos)}
- Valor Líquido Resultante: ${formatCurrency(valorLiquido)}
- Carga Tributária Efetiva: ${valorBruto > 0 ? ((totalImpostos / valorBruto) * 100).toFixed(2) : 0}%

DETALHAMENTO DOS IMPOSTOS:
- ICMS: ${document.getElementById('demo-valor-icms').textContent}
- PIS: ${document.getElementById('demo-valor-pis').textContent}
- COFINS: ${document.getElementById('demo-valor-cofins').textContent}
${document.getElementById('incluir-ipi').value === 'sim' ? `- IPI: ${document.getElementById('demo-valor-ipi').textContent}` : ''}

ALÍQUOTAS UTILIZADAS:
- ICMS: ${document.getElementById('aliquota-icms').value}%
- PIS: ${document.getElementById('aliquota-pis').value}%
- COFINS: ${document.getElementById('aliquota-cofins').value}%
${document.getElementById('incluir-ipi').value === 'sim' ? `- IPI: ${document.getElementById('aliquota-ipi').value}%` : ''}

OBSERVAÇÕES:
- Este cálculo considera a incidência simultânea dos impostos
- Os valores podem variar conforme a legislação específica
- Recomenda-se validação com contador ou advogado tributário
        `;
        
        const blob = new Blob([relatorio], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio-gross-up-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    // Adicionar botões de ação se não existirem
    if (!document.getElementById('acoes-gross-up')) {
        const acoesDiv = document.createElement('div');
        acoesDiv.id = 'acoes-gross-up';
        acoesDiv.className = 'text-center mt-2';
        acoesDiv.innerHTML = `
            <button onclick="exportarCalculo()" class="btn">Exportar Cálculo</button>
            <button onclick="gerarRelatorioDetalhado()" class="btn" style="margin-left: 1rem;">Relatório Detalhado</button>
        `;
        
        const container = document.querySelector('.container');
        if (container) {
            container.appendChild(acoesDiv);
        }
    }
});

