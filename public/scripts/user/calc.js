$('.calc-input').bind('keyup mouseup', e => {
    const weight = $('#calcWeight').val();
    const width = $('#calcWidth').val();
    const height = $('#calcHeight').val();
    const length = $('#calcLength').val();
    console.log(weight, width, height, length)
    if((!isNaN(weight)
        && !isNaN(width)
        && !isNaN(height)
        && !isNaN(length)) 
        && weight.length != 0
        && width.length != 0
        && height.length != 0
        && length.length != 0){
            const sizeCoef = 0.2;
            const price = weight * 5.2 + width*sizeCoef + height*sizeCoef + weight*sizeCoef;
            $('#calcPrice').text((Math.round(price * 100) / 100).toFixed(2) + ' грн.') 
        }
})