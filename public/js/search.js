

$( document ).ready(function() {

   //var size = {{newSize}} ;

    //slide show toogle on button click

    $('#carouselbtn').click(function () {
        $('#incCarousel').toggle();
    });

    //search checkbox list

    $("#usertypeSearch").on("keyup click input", function () {
        if (this.value.length > 0) {
            $("#usertype li").hide().filter(function () {
                return $(this).text().toLowerCase().indexOf($("#usertypeSearch").val().toLowerCase()) != -1;
            }).show();
        }
        else
            $("#usertype li").show();
    });

    $("#updbySearch").on("keyup click input", function () {
        if (this.value.length > 0) {
            $("#updby li").hide().filter(function () {
                return $(this).text().toLowerCase().indexOf($("#updbySearch").val().toLowerCase()) != -1;
            }).show();
        }
        else
            $("#updby li").show();
    });

    $("#prioritySearch").on("keyup click input", function () {
        if (this.value.length > 0) {
            $("#priority li").hide().filter(function () {
                return $(this).text().toLowerCase().indexOf($("#prioritySearch").val().toLowerCase()) != -1;
            }).show();
        }
        else
            $("#priority li").show();
    });

    $("#statusSearch").on("keyup click input", function () {
        if (this.value.length > 0) {
            $("#status li").hide().filter(function () {
                return $(this).text().toLowerCase().indexOf($("#statusSearch").val().toLowerCase()) != -1;
            }).show();
        }
        else
            $("#status li").show();
    });

    // distance checkbox toggle

    $('input[name=distance]').click(function(){
        $('input[name=distance]').not(this).prop('checked', false);
    });


    //Incidence Search

    $("#searchButton").click(function () {
        var query = $('#query').val();
        $.ajax({
            type: "get",
            url: "/home/search",
            data: {query}
        }).success(function (data) {
            var source = $('' + data + '');
            $('#resultList').html(source.find('#resultList').html());
            $('input[type=checkbox]').prop("checked", false);
        });
    });

    $("#loadMore").click(function () {
      debugger;
        var size = $("#paginationSize").attr('name');

         $.ajax({
            type: "POST",
            url: "/home/load",
            data: {size}
        }).success(function (data) {
            var source = $('' + data + '');
            $('#resultList').html(source.find('#resultList').html());
            $('input[type=checkbox]').prop("checked", false);
        });
    });

/*
    $("#previousResult").click(function () {
      debugger;
        var size = $("#paginationSize").attr('name');

         $.ajax({
            type: "POST",
            url: "/home/previous",
            data: {size}
        }).success(function (data) {
            var source = $('' + data + '');
            $('#resultList').html(source.find('#resultList').html());
            $('input[type=checkbox]').prop("checked", false);
        });
    });
*/

    // filter usertype,updy,priority and status based on name of checkboxes

    $(".filter-aggs").click(function (e) {

        var query = $('#query').val();
        var checked={};
        checked.distance=[];
        checked.status=[];
        checked.priority=[];
        checked.usertype=[];
        checked.updby=[];

        $(".filter-aggs:checkbox:checked").each(function(){

            if(this.name=="distance")
                checked.distance.push(this.id);
            if(this.name=="status")
                checked.status.push(this.id);
            if(this.name=="priority")
                checked.priority.push(this.id);
            if(this.name=="usertype")
                checked.usertype.push(this.id);
            if(this.name=="updby")
                checked.updby.push(this.id);


        });

        $.ajax({
            type:"post",
            url:"/home/search/filter-aggs",
            data:{checked:JSON.stringify(checked),searchTerm:query}
        }).success(function (data) {
            var source = $('' + data + '');
            $('#resultList').html(source.find('#resultList').html());
        });
    });


    $(".incidenceid").click(function () {
         debugger;
         var id = this.id;
         console.log(id);
         $.ajax({
             type: "POST",
             url: "/home/incidence",
             data: {id}
         }).success(function (data) {
             window.location = data.redirect;
         });
     });

/*
search function on press enter .
*/
$("#query").keypress(function(e) {
    if(e.which == 13) {

    $("#searchButton").click();
    }
});


});
