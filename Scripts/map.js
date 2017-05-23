function initMap() {
    var street = {lat: 53.611746, lng: 21.831979};

    var map = new google.maps.Map(document.getElementById('google-map'), {
        zoom: 16,
        center: street
    });

    var marker = new google.maps.Marker({
        position: street,
        map: map
    });

    google.maps.event.trigger(map, 'resize');
}


$('#map').on('hidden.bs.collapse', function () {
});

$('#map').on('shown.bs.collapse', function () {
    initMap(); 
});