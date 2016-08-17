$(document).ready(function() {
	var reloadTasks = function() {
		$.get('/api/list').done(function(data) {
			try {
				var result = $.parseJSON(data);
				$("#tasks ul").html("");
				result.forEach(function(task) {
					var deleteA = document.createElement('a');
					$(deleteA).attr("href", task.id);
					$(deleteA).addClass("deleteTask");
					$(deleteA).html("Удалить");

					$(deleteA).click(function() {
						$.post('/api', {"delete":$(this).attr('href')}).done(function(data) {
							console.log("task deleted");
							reloadTasks();
						});
						return false;
					});

					var editA = document.createElement('a');
					$(editA).attr("href", task.id);
					$(editA).addClass("editTask");
					$(editA).html("Изменить");
					
					$(editA).click(function() {
						$("#createTask").hide();
						$("#editTask").show();
						$("#editTask input[name=task]").val(task.task);
						$("#editTask input[name=change]").val(task.id);
						$("#editTask select[name=priority]").val(task.priority);
						$("#cancelEdit").show();
						return false;
					});

					$("#cancelEdit").click(function() {
						$("#cancelEdit").hide();
						$("#createTask").show();
						$("#editTask").hide();
						return false;
					});

					$("#tasks ul").append("<li>"+task.task+", приоритет: "+task.priority);
					$("#tasks ul").append(task.completed==1?"<p>Выполнена</p>":"<p>НЕ Выполнена</p>");
					if (task.completed==0) {
						var completeA = document.createElement('a');
						$(completeA).attr("href", task.id);
						$(completeA).addClass("editTask");
						$(completeA).html("Выполнить");
						$(completeA).click(function() {
							$.post('/api', {"complete":$(this).attr('href')}).done(function(data) {
								console.log("task completed");
								reloadTasks();
							});
							return false;
						});
						$("#tasks ul").append("<p>");
						$("#tasks ul").append(completeA);
						$("#tasks ul").append("</p>");
					}
					$("#tasks ul").append(deleteA);
					$("#tasks ul").append(editA);
					$("#tasks ul").append("</li>");
				})
			}
			catch(err) {

			}
		});
	}

	$("#createTask").submit(function() {
		$.post('/api', $(this).serialize()).done(function(data) {
			console.log("task created");
			reloadTasks();
		});
		return false;
	});
	$("#editTask").submit(function() {
		$.post('/api', $(this).serialize()).done(function(data) {
			console.log("task edited");
			$("#cancelEdit").hide();
			$("#createTask").show();
			$("#editTask").hide();
			reloadTasks();
		});
		return false;
	});
	
	
	reloadTasks();
});