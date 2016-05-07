window.onload = function()
{
   // Create and draw the programming language proficiency bar graph
   var canvas = document.getElementById("programmingChartCanvas");
   var chart = new Chart(canvas, {
    type: "bar",
    data: {
     labels: ["C++", "Java", "Python", "C#", "JavaScript", "HTML/CSS", "F#", "Assembly"],
     datasets: [{
      label: "Proficiency %",
      backgroundColor: "rgba(39, 174, 96, 0.8)",
      data: [90, 85, 82, 75, 65, 60, 50, 25]
     }]
    },
    options: {
     scales: {
      yAxes: [{
       ticks: {
        beginAtZero: true,
        max: 100
        }
      }]
     }
    }
   });
   
   // JQuery slide toggle click events
   $("#programming-language-toggle").click(toggleProgrammingLanguages);
   $("#projects-toggle").click(toggleProjects);
}

