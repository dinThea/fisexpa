var averageTermsEl
var averageInEl
var averageLabels
var averageFormulas
var averageTerms = []

const downloadImage = (filename, data) => {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:image/png;' + data);
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

const averageLoadElements = () => {
    
    // Elements
    averageTermsEl  = $('#average-terms')
    varianceEl      = $('#variance')
    stddevianceEl   = $('#stddeviance')
    averageLabels   = $('.avg-label')
    averageInEl     = $('#average')
    averageFormulas = $('section.average .result')

    averageFormulas.click( event => {
        let el = event.target
        console.log(el)
        html2canvas(el)
            .then(image => downloadImage('formula', image.toDataURL()))
    })    
}

function calculateAverage(e)
{   
    e.which = e.which || e.keyCode
    
    if(e.which == 13 || e.which == 8){
        // On backspace
        if(e.which == 8 && averageInEl.val() == '')
            averageTerms.pop()
        else{
        // On Enter
            let val = averageInEl.val()
            if(val)
                averageTerms.push(parseFloat(val))
        }

        // Terms calculation results
        let average = (averageTerms.reduce((p, c) => p + c, 0) / averageTerms.length)
        let variance = averageTerms.reduce((p, c) => p + Math.pow(c - average, 2), 0) / (averageTerms.length * (averageTerms.length - 1))
        // TeX term sum strings
        let termSumString = averageTerms.reduce((p, c, i) => p + (i != 0 ? ' + ' : '' ) + c, '')
        let termVarianceSumString = averageTerms.reduce((p, c, i) => p + (i != 0 ? ' + ' : '' ) + `(${c}-${average.toFixed(1)})^2 ${i != 0 && !(i % 5) ? "\\\\" : ''}`, '')
        // TeX Formulas
        let avgFormulaTex = `\\LARGE{\\mu = \\frac{1}{n}\\cdot\\sum\\limits_{i=1}^n x_i = \\frac{${termSumString}}{${averageTerms.length}} = ${average.toFixed(4)}}`    
        let varianceFormulaTex = `\\nu = \\frac{1}{n(n - 1)} \\cdot\\sum\\limits_{i=1}^n  (x_i - \\mu)^2 = \\frac{${termVarianceSumString}}{${averageTerms.length - 1}} = ${variance.toFixed(4)}`
        let stddevianceFormulaLatex = `\\sigma = \\sqrt{\\nu} = \\sqrt{${variance.toFixed(4)}} = ${Math.sqrt(variance).toFixed(4)}`
        // Tex Rendering
        katex.render(avgFormulaTex, averageTermsEl[0], { throwOnError: false })
        katex.render(varianceFormulaTex, varianceEl[0], { throwOnError: false })
        console.log(varianceFormulaTex)
        katex.render(stddevianceFormulaLatex, stddevianceEl[0], { throwOnError: false })
        console.log(stddevianceFormulaLatex)
        // Showing labels        
        for(el of averageLabels)
            el.style.display = averageTerms.length ? 'block' : 'none'
        // Resetting input
        if(e.which != 8 || (e.which == 8 && !average.val()))
            averageInEl.val('')
    } 

}