$(function() {
 
    var lat = 48.621025, lon = 22.288229;
    var departmentAddress = '';

    $('.map').locationpicker({
       location: {latitude: lat, longitude: lon},   
       radius: 0,
       enableAutocomplete: true,
       onchanged: function(currentLocation, radius, isMarkerDropped) {
          lat = currentLocation.latitude;
          lon = currentLocation.longitude;
          getLocationByCoordinates();
        }
    });


    function getLocationByCoordinates() {
      jQuery.ajax({
        type: "GET",
        url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}
        &language=uk&location_type=ROOFTOP&result_type=street_address&key=AIzaSyAb0FDX-kXAMDvawZWxn43QqTT8xW0QLc0`,
        success: function (result) {
          console.log(result)
          if(result.results.length > 0){
            departmentAddress = result.results[0].formatted_address;
          } else {
            departmentAddress = result.plus_code.compound_code;
          }
          
          $('#lat').val(lat);
          $('#lon').val(lon);
          $('#location').val(departmentAddress);

          $('#latEdit').val(lat);
          $('#lonEdit').val(lon);
          $('#locationEdit').val(departmentAddress);
        },
        error: (error) => {
          alert(error.responseText);
        },
      });
    }

});