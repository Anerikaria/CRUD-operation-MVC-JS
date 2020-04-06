
//All Variables of HTML
var sp = document.getElementById("main");
var Id = document.getElementById("hdnPID");// get Id

var link = document.getElementById("link");// get link id to Add new data
var closeButton = document.getElementsByClassName("close")[0]; // get id to close the popup modal 
var modal = document.getElementById("my__Modal"); // get id to open the modal

// variable to save the data
var addDatav = document.getElementById("addData");// get id of the button add
var txtName = document.getElementById("spName").value; // get id of modal textbox

//button variable
let button = document.querySelector('.add');// get classname of button add
let buttonText = document.querySelector('.tick');// get classname of animation button
//const tickMark = "<svg width=\"58\" height=\"45\" viewBox=\"0 0 58 45\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"#fff\" fill-rule=\"nonzero\" d=\"M19.11 44.64L.27 25.81l5.66-5.66 13.18 13.18L52.07.38l5.65 5.65\"/></svg>";

buttonText.innerHTML = "Add"// button Text is Add when initially 


//Pagination Variables
var list = new Array();
var pageList = new Array();
var currentPage = 1;
var numberPerPage = 5;
var numberOfPages = 0;



// Intialisefunction with none value
function init() {
    document.getElementById("spName").value = '';
    buttonText.innerHTML = "Add"
    addDatav.classList.remove('button__circle');
}

//Edit the value
//var Edit = document.getElementsByTagName("a")[1].setAttribute("id", "Editbtn");

// To count the data number-----------------------------------------------------------------------------------------
countDatasp = new Array();
countDatasp = function countData() {
    var ourCount = new XMLHttpRequest();
    ourCount.open('GET', 'https://task-digitalityy.azurewebsites.net/SupplyChain/SPchainCount');
    ourCount.onload = function () {
        var Data = JSON.parse(ourCount.responseText);
        renderHtml(Data);
        console.log(Data);
    }

    ourCount.send();
}

var arrayData = [];


//AJAX call to get the Data from Controller-------------------------------------------------------------
function loadData() {
    var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', 'https://task-digitalityy.azurewebsites.net/SupplyChain/GetItemsData');
    ourRequest.onload = function () {
        var Data = JSON.parse(ourRequest.responseText);
        arrayData = Data;
        renderHtml(arrayData);
        console.log(arrayData);

    }

    ourRequest.send();
}

//function loadData() {
//    $.ajax({
//        type: "GET",
//        url: 'http://localhost:51165/SupplyChain/GetItemsData',
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (response) {
//            var Data = JSON.parse(response.responseText);
//            arrayData = Data;
//            renderHtml(arrayData);
//            console.log(arrayData);

//        }

//    });
//}
loadData();

function addLocalstorage() {
    var Id = document.getElementById("hdnPID").value;// get Id
    var txtName = document.getElementById("spName").value; // get id of modal textbox
    const key = Id.value;
    const value = txtName;

    localStorage.setItem(key, value);

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        renderHtml += `${key}: ${value}`;
    }
}

//Ajax to enter the data to the database -----------------------------------------------------------
addDatav.onclick = function () {
    var txtName = document.getElementById("spName").value;
    //alert($(this).attr("data-EditId"))
    if ($(this).attr("data-EditId") != null && $(this).attr("data-EditId").length > 0) {
        //edit
        editData($(this).attr("data-EditId"), txtName);
    }
    else if ($(this).attr("data-EditId") == null )
    {
        //Add
        //var Id = document.getElementById("hdnPID").value;// get Id
        $.ajax({
            type: "POST",
            url: "https://task-digitalityy.azurewebsites.net/SupplyChain/AddSPchain",
            data: JSON.stringify({ "Name": txtName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function (result) {
                loadData();
                //Successfully gone to the server and returned with the string result of the server side function do what you want with the result
                //buttonText.innerHTML = tickMark;
                //addDatav.classList.add('button__circle');
                var newMessage = 'Data Added Successfully!';
                bootbox.alert(newMessage);
                modal.style.display = "none";
                init();

            }
            , error(er) {
                //Faild to go to the server alert(er.responseText)

            }

        })
    }

}

//Modal Open when edit the data--------------------------------------------------------------------------------
function openEditModel(Id, NameObj) {
    buttonText.innerHTML = "Update";
    modal.style.display = "block";
    $("#spName").val(NameObj);
    $("#my__Modal #addData").attr("data-EditId", Id);
    
}


//Ajax to edit the data from the database -----------------------------------------------------------
function editData(Id, NameObj) {
    //    let data = arrayData.slice();
    //    for (let i = 0, n = arrayData.length; i < n; i++) {

    //}
    console.log(Id);
    console.log(NameObj);
    var spObj = {
        Id: Id,
        Name: NameObj
    };

    $.ajax({
        url: "https://task-digitalityy.azurewebsites.net/SupplyChain/EditSPchain",
        data: JSON.stringify(spObj),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function () {
            loadData();
            $("#my__Modal #addData").removeAttr("data-EditId");
            var newMessage = 'Data Edited Successfully!';
            bootbox.alert(newMessage);
            modal.style.display = "none";
            init();

        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });

}


// AJAX to delete thed data from the database ----------------------------------------------------------------
function deleteData(Id) {
    Id = parseInt(Id);
    bootbox.confirm({
        title: 'Remove Data',
        message: 'Are you sure want to delete this record?',
        buttons: {
            'cancel': {
                label: 'No',
                className: 'btn-default pull-right'
            },
            'confirm': {
                label: 'Yes',
                className: 'btn-primary margin-right-5'
            }
        },
        callback: function (result) {
            if (result) {
                $.ajax({
                    url: "https://task-digitalityy.azurewebsites.net/SupplyChain/DeleteSPchain",
                    type: 'POST',
                    data: JSON.stringify({
                        "Id": Id
                    }),
                    contentType: 'application/json; charset=utf-8;',
                    success: function (result) {
                        loadData();
                        if (result.Status == "True") {
                            toastr.success(result.Message);
                            init();
                        } else {
                            toastr.success(result.Message);
                        }
                    }
                });
            }
        }
    });
}

//Loop through the data and give it to the AJAX ---------------------------------------------------------
function renderHtml(data) {
    var htmlString = "";

    for (i = 0; i < data.length; i++) {
        htmlString += ("<p>" + data[i].Name + " <a id=\"deleteBtn\" onclick=\"deleteData(" + data[i].Id + ")\">" + "Delete" + "<i class=\"fa fa-trash-o\" style=\"font-size:22px\" \"color:orangered\">" + "</i>" + "</a>" + " &nbsp; " + "<a id=\"editBtn\"  onclick=\"openEditModel(" + data[i].Id + " , '" + data[i].Name + "')\">" + "Edit" + "<i class=\"fa fa-pencil\" style=\"font-size:22px\" \"color:limegreen\">" + "</i>" + "</a>" + "</p>");
    }
    sp.innerHTML = htmlString;
    //p.insertAdjacentHTML('beforeend', htmlString);


}




//Modal Part ------------------------------------------------------------------------------------------------

//Click link to open the modal
link.onclick = function () {
    modal.style.display = "block";
    init();
    //addDatav.classList.remove('button__circle');
    //buttonText.innerHTML = "Add"
}

//to close the modal
closeButton.onclick = function () {
    modal.style.display = "none";
    init();
}

//if click outside modal will colse
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        init();
    }
}





//Button animation-------------------------------------------------------------------------------------------

//button.addEventListener('click', function () {


//    if (document.getElementById("spName").value == '') {
//        var newAlert = 'Please enter the value'
//        alert(newAlert);
//    }

//});




//Pagination-----------------------------------------------------------------------------------------------
//function makeList() {
//    debugger;
//    for (x = 0; x < arrayData.length; x++)
//        list.push(x);

//    numberOfPages = getNumberOfPages();
//    console.log(numberOfPages);
//    console.log(arrayData.length);
//}

//function getNumberOfPages() {
//    return Math.ceil(list.length / numberPerPage);
//}

//function nextPage() {
//    currentPage += 1;
//    loadList();
//}

//function previousPage() {
//    currentPage -= 1;
//    loadList();
//}

//function firstPage() {
//    currentPage = 1;
//    loadList();
//}

//function lastPage() {
//    currentPage = numberOfPages;
//    loadList();
//}

//function loadList() {
//    var begin = ((currentPage - 1) * numberPerPage);
//    var end = begin + numberPerPage;

//    pageList = list.slice(begin, end);
//    drawList();
//    check();
//}

//function drawList() {
//    document.getElementById("list").innerHTML = "";

//    for (r = 0; r < pageList.length; r++) {
//        document.getElementById("list").innerHTML += pageList[r] + "<br/>";
//    }
//}

//function check() {
//    document.getElementById("next").disabled = currentPage == numberOfPages ? true : false;
//    document.getElementById("previous").disabled = currentPage == 1 ? true : false;
//    document.getElementById("first").disabled = currentPage == 1 ? true : false;
//    document.getElementById("last").disabled = currentPage == numberOfPages ? true : false;
//}


//function load() {
//    makeList();
//    loadList();
//}

//window.onload = load;
