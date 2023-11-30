
let toPayValue = -1;
let depId = '';


$('body').on('click', '.dep-item', function(e){
    depId = $(e.target).closest('.list-group-item').attr('id');
    $(".dep-item").removeClass("custom_active");
    $(e.target).closest('.dep-item').addClass('custom_active');
})

$('#depForm').on('submit', e => {
    e.preventDefault();
    if(!$('#departmentsList .dep-item').hasClass('custom_active')){
        alert('Виберіть відділення, куди буде доправлено відправлення!');
    } else {
        const pickedDep = departmentArr.find(x => x._id == depId);
        $('#sendingWeight').attr('max', pickedDep.max_weight);
        $('#depModal').modal('hide');
        $('#sendingModal').modal('show');
    }
})


$('.sending-input').bind('keyup mouseup', e => {
    const weight = $('#sendingWeight').val();
    const width = $('#sendingWidth').val();
    const height = $('#sendingHeight').val();
    const length = $('#sendingLength').val();
    if((!isNaN(weight)
        && !isNaN(width)
        && !isNaN(height)
        && !isNaN(length)) 
        && weight.length != 0
        && width.length != 0
        && height.length != 0
        && length.length != 0){
            console.log('auuu')
            const sizeCoef = 0.2;
            toPayValue = weight * 5.2 + width*sizeCoef + height*sizeCoef + weight*sizeCoef;
            $('#toPayButton').val('До оплати: ' + (Math.round(toPayValue * 100) / 100).toFixed(2) + ' грн.') 
        }
})
let isInAction = false;

$("#sendingForm").on('submit', function(e) {
    if(!isInAction){
        isInAction = true;
        e.preventDefault();
        if(toPayValue > clientObj.billing){
            alert('На рахунку недостатньо коштів!');
        } else {
            jQuery.ajax({
                type: "post",
                url: "/registeringSending",
                data: $("#sendingForm").serialize() + '&cost=' + toPayValue + '&department=' + depId,
                success: (result) => { 
                    
                    console.log(result)
                    socket.emit('added_sending', result);
                    location.reload();
                 },
                error: (error) => { 
                    alert(error.message)
                    isInAction = false;
                },
            });
        }
    }
   
})


    socket.on('send_give_code', function(msg) {
        console.log('auuuu')
        if(msg.client == clientObj._id){
            alert("Код видачі: " + msg.code);
        }
    });