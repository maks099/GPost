$('.filter_input').on('input', function(){
    const town = $('#townName').val().trim().toUpperCase();
    const state = $('#stateName').val().trim().toUpperCase();
    const street = $('#streetName').val().trim().toUpperCase();

    $('#departmentsList').empty();
    if(town.length == 0 && state.length == 0 && street.length == 0){
        departmentArr.forEach(e => {
            if(isAdmin){
                addDepartmentToList(e)
            } else{
                addDepartmentToListSimple(e)
            }
          
        })
    } else {
        departmentArr.forEach(e => {
            const address = e.address.toUpperCase().split(',').reverse();
            if(isNaN(address[0])){
                if(address[1].includes(state) && address[2].includes(town)){
                    if(isAdmin){
                        addDepartmentToList(e)
                    } else{
                        addDepartmentToListSimple(e)
                    }
                }
            } else {
                if(address[2].includes(state) && address[3].includes(town) && address[5].includes(street)){
                    if(isAdmin){
                        addDepartmentToList(e)
                    } else{
                        addDepartmentToListSimple(e)
                    }
                }
            }
           
        })
    }
})



function addDepartmentToListSimple(e){
    $('#departmentsList').append(`
    <div class="list-group-item dep-item  p-2 " id=${e._id}>
        <div>${ e.name }</div>
        <div><small>${ e.address }</small></div>
        <div><small>Максимальна вага: ${ e.max_weight }</small></div>
    </div>
`)
}


