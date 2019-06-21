$(function() {
  // The taskHtml method takes in a JavaScript representation
  // of the task and produces an HTML representation using
  // <li> tags
  function taskHtml(task) {
    var checkedStatus = task.done ? "checked" : "";
    var checkedImportant = task.important ? "checked" : "";
    var liClass = task.done ? "completed" : "";
    var liElement = ''
    //Formatting Task Create date
    var taskCreatedDate = new Date(task.created_at);
    var newDate = new Date(taskCreatedDate.getFullYear(), taskCreatedDate.getMonth(), taskCreatedDate.getDate());
    var setCreatedAtDate = (newDate.getMonth())  +'/'+ newDate.getDate() +'/'+ newDate.getFullYear();

    if (checkedImportant == "checked") 
    {
       liElement = '<li id="listItem-' + task.id +'" class="' + liClass + '">' +
    '<div class="view"><input class="toggle" type="checkbox"' +
      " data-id='" + task.id + "'" +
      checkedStatus +
      '><label>' +
       task.title + '</label>' + 
       //'<input class="toggleTaskImportant" type="radio" float="right"' +
     // " data-id='" + task.id + "'" + "id='radiobutton" + task.id + "'" +
     // checkedImportant  + '>'
       '<img class="importantImg" style ="position:absolute;right:0px;" src="http://www.enhancedtech.com/wp-content/uploads/2017/09/wunderlist_icon__flurry_ios_style__by_flakshack-d5om13z.png" width="20px;" height= "20px;" alt="important task icon" title="Important task"'+ "id=" + task.id + 
        '></div><div><label class="created_at_date" style="font-size:12px;">' + 'Noted on:'+ setCreatedAtDate + '</label></div></li>';
     }
     else{
      liElement = '<li id="listItem-' + task.id +'" class="' + liClass + '">' +
    '<div class="view"><input class="toggle" type="checkbox"' +
      " data-id='" + task.id + "'" +
      checkedStatus +
      '><label>' +
       task.title + '</label>' +
      // '<input class="toggleTaskImportant" type="radio" float="right"' +
     // " data-id='" + task.id + "'" + "id='radiobutton" + task.id + "'" +
    //  checkedImportant  + '>'
       '<img class="allTasksIconImg" style ="position:absolute;right:0px;" src="https://cdn3.iconfinder.com/data/icons/popular-services-brands-vol-2/512/wunderlist-128.png" width="20px;" height= "20px;" alt="not an important task icon" title="Click here to mark as Important"' +  "id=" + task.id +
        '></div><div><label class="created_at_date" style="font-size:12px;">' + 'Noted on:'+ setCreatedAtDate + '</label></div></li>';
     }
    return liElement;
  }

  // toggleTask takes in an HTML representation of the
  // an event that fires from an HTML representation of
  // the toggle checkbox and  performs an API request to toggle
  // the value of the `done` field
  function toggleTask(e) {
    var itemId = $(e.target).data("id");
     // alert('Inside the toggletask:'+itemId);
    var doneValue = Boolean($(e.target).is(':checked'));
   
    $.post("/tasks/" + itemId, {
      _method: "PUT",
      task: {
        done: doneValue
      }
    }).success(function(data) {
      var liHtml = taskHtml(data);
      var $li = $("#listItem-" + data.id);
      $li.replaceWith(liHtml);
      $('.toggle').change(toggleTask);
      UpdateTotal();
    });
  }

 /* function toggleTaskImportant(e) {
    var itemId = $(e.target).data("id");
                                        alert('Inside the toggletask important:'+itemId);
      console.log(e);
    var importantValue = Boolean($(e.target).is(':checked'));
     if($('.toggleTaskImportant').is(':checked')) 
      { 
        alert("radio button is selected"); 
      }

    $.post("/tasks/" + itemId, {
      _method: "PUT",
      task: {
        important: importantValue
      }
    }).success(function(data) {
      var liHtml = taskHtml(data);
      var $li = $("#listItem-" + data.id);
      $li.replaceWith(liHtml);
      console.log(data);
      alert(data.title + ' has been marked as an important');
      $('.toggleTaskImportant').change(toggleTaskImportant);
      $('.importantImg').change(toggleImage);
       UpdateTotal();
    });
  }*/

  function toggleImageImportant(e)
  {
    //alert('inside image function');

   /// $('#dialog').show();
  // alert('This task will be marked as important');
   console.log(e.target);
   var itemId = (e.target.id)
   // alert('Inside the toggletask important:'+itemId);
   var importantValue = true;
   $.post("/tasks/" + itemId, {
      _method: "PUT",
      task: {
        important: importantValue
      }
    }).success(function(data) {
      var liHtml = taskHtml(data);
      var $li = $("#listItem-" + data.id);
      $li.replaceWith(liHtml);

      //alert('Inside the success of toggle task important'+data);
      //debugger;
      alert(data.title + ' has been marked as an important');
     // $('.toggleTaskImportant').change(toggleTaskImportant);
      //$('.importantImg').change(toggleImage);
      UpdateTotal();
    });
   
    //UpdateTotal();
  }

  function toggleImageUnImportant(e)
  {
   
   //alert('This task will be marked as unimportant');
   console.log(e.target);
   var itemId = (e.target.id)
    //alert('Inside the toggletask important:'+itemId);
   var importantValue = false;
   $.post("/tasks/" + itemId, {
      _method: "PUT",
      task: {
        important: importantValue
      }
    }).success(function(data) {
      var liHtml = taskHtml(data);
      var $li = $("#listItem-" + data.id);
      $li.replaceWith(liHtml);

     // alert(data);
     // debugger;
      alert(data.title + ' has been marked as an unimportant');
     // $('.toggleTaskImportant').change(toggleTaskImportant);
    
    });
 
    UpdateTotal();
  
  }



  $.get("/tasks").success(function( data ) {
      var htmlString = "";
    UpdateTotal();
    $.each(data, function(index,  task) {
      htmlString += taskHtml(task);
    });

    var ulTodos = $('.todo-list');
    ulTodos.html(htmlString);
   // alert('The html string is:'+htmlString);
    $('.toggle').change(toggleTask);
    UpdateTotal();
    // alert('inside the get tasks function');
   // $('.toggleTaskImportant').change(toggleTaskImportant); 

    $('.allTasksIconImg').click(toggleImageImportant); ///This function is being called when the user cicks on the image after all the tasks are loaded onto the page
    $('.importantImg').click(toggleImageUnImportant);
  });


  $('#new-form').submit(function(event) {
    //event.preventDefault(); 
    var textbox = $('.new-todo');
    var payload = {
      task: {
        title: textbox.val()
      }
    };
    $.post("/tasks", payload).success(function(data) {
      
      var htmlString = taskHtml(data);
      alert(textbox.val() + ' has been added to your To Do list');
      textbox.val('');
      var totalTasks = data.length;
     
      var divTotal = $('#total');

      var ulTodos = $('.todo-list');
      ulTodos.append(htmlString);
      $('.toggle').click(toggleTask);
      // alert('New form function is here');
       UpdateTotal();
     // $('.toggleTaskImportant').click(toggleTaskImportant); ///changed this from toggleTaskImportant 
      $('.importantImg').click(toggleImageUnImportant);
    });
  });


////New function to update the total

function UpdateTotal(){
  $.get("/tasks").success( function( data ) {
      var htmlString = "";
      // alert('Inside the toggle task functionthe Total number of task is:'+data.length);
      // console.log(data);

      var totalCompletedTasks = 0;
      var checkedImportantTasks = 0;
      var taskNotCompleteAndImportantToDo = 0;
      $.each(data, function(index,  task) {
        totalCompletedTasks += task.done ? 1 : 0;
        checkedImportantTasks = task.important ? 1 : 0;
            if ((!task.done && task.important))
            {
              taskNotCompleteAndImportantToDo ++;
            }
      });
       var totalTasks = data.length;
       var divTotal = $('#total');
      // alert('The completed tasks inside the toggle task is:'+totalCompletedTasks);
      // alert('Task not completed but important to do:'+taskNotCompleteAndImportantToDo);
       divTotal.html('<b style="padding-left:1%">Total Tasks:  '+totalTasks+ '</b>' + '<b style="color:blue;padding-left: 18%;" title="Awesome!!Keep up the pace!!">Completed Tasks:'+totalCompletedTasks + '</b>'+ '<b style="color:#DB4C3F;padding-left:10%" title="Hurry!!You can do it!"> Important To Do Task:'+taskNotCompleteAndImportantToDo);
      });
}
 
}); 

