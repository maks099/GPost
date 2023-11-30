$(function() {
 
    departmentArr.forEach(e => {
        addDepartmentToList(e)
        $("#depSelectList").append(`
            <option value="${e._id}">${e.name}</option>
        `);
    });

    $('body').on('click', '.dep-item', function(e){
        const id = $(e.target).closest('.list-group-item').attr('id');
        $('#addWorkerDepId').val(id);
        $(".dep-item").removeClass("custom_active");
        $(e.target).closest('.dep-item').addClass('custom_active');
        $('#workersListView').empty();
        workersArr.forEach(e => {
            if(e.department == id){
                addWorker(e)
            }
         
        });
    })

    $('body').on('click', '.edit-dep', e => {
        const id = $(e.target).closest('.list-group-item').attr('id');
        const dep = departmentArr.find(x => x._id == id);
        $('#idEdit').val(id);
        $('#locationEdit').val(dep.address);
        $('#nameEdit').val(dep.name);
        $('#maxWeightEdit').val(dep.max_weight);

        lat = dep.lat;
        lon = dep.lon;
        $('.map').locationpicker({
            location: {latitude: lat, longitude: lon},   
            radius: 10,
            enableAutocomplete: true,
        })

        $('#editDepartmentModal').modal('show');
    });


    $('body').on('click', '.del-dep', e => {
        const id = $(e.target).closest('.list-group-item').attr('id');
        const del = confirm("Ви справді бажаєте видалити це відділення?");
        if(del){
            jQuery.ajax({
                type: "post",
                url: "/deleteDepartment",
                data: {
                    id: id,
                },
                success: (result) => { location.reload() },
                error: (error) => { location.reload() },
            });
        }
    });
})

function addDepartmentToList(e){
    $('#departmentsList').append(`
    <div class="list-group-item d-flex flex-row dep-item align-items-center justify-content-between" id="${e._id}">
        <div class="">
            <div><span>${e.name}</span></div>
            <div><small>${e.address}</small></div>
        </div>
        <div class="d-flex flex-row align-items-center justify-content-end">
            <div class="d-flex flex-column">
                <i class="bi bi-pencil-square mx-1 edit-dep" style="font-size: 1.75rem; cursor: pointer;" title="Редагувати"></i>
                <i class="bi bi-trash2 mx-1 del-dep" style="font-size: 1.75rem; cursor: pointer;" title="Видалити"></i>
            </div>
            <a style="color: black" href="/department/:id?id=${e._id}"><i class="bi bi-mailbox mx-1 open-dep" style="font-size: 1.75rem; cursor: pointer;" title="Переглянути"></i></a>
        <div>
    </div>
    `
);
}