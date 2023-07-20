
// Set Variables

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";


const jsonData = d3.json(url);

let testSubjectDropDownID = d3.select("#selDataset");
let metaDataTag = d3.select("#sample-metadata");

//For Testing Purposes
console.log("Getting Data: ",jsonData);

// Use callback funtion for the selection of the drop down


function init() {
   
// Initialization function to:
//  - Create Test Subject ID no. dropdown list
//  - Populate the dropdown list with ['names'] from the sample.json file


// Grab json data from 'https://2u-data-curriculum-team'

    d3.json(url).then(function(jsonData) {
        console.log("Loading Data");
        data = jsonData;
        console.log("Keys: " + Object.keys(data));
        names = data.names;

        // Create and populate the Test Subject ID
        names.forEach(function(element){
            testSubjectDropDownID.append("option").text(element).property("value", element); 
        });
                    
        // Initialize the Demographic chart with first ID number
        let id_num = names[0];

       
        demographyTable(id_num);
        barGraphDraw(id_num)
        bubbleGraphDraw(id_num);
        gaugeGraphDraw(id_num);
     
    });
}

function demographyTable(id_num){
    // Clean table
    metaDataTag.html("");
    var meta_data = data.metadata.filter(row => row.id == id_num);
        Object.entries(meta_data[0]).forEach(([key, value]) => { 
            //metaDataTag.append("h6").text(`${key.toUpperCase()}: ${value}`)
            metaDataTag.append("h6").text(`${key}: ${value}`)
        });
}
       
function barGraphDraw(id_num){
    d3.json(url).then((data) => {
        var selectionID = data.samples;
        var filterRow = selectionID.filter(row => row.id == id_num);
        var results = filterRow[0];
        var sample_values = results.sample_values;
        var otu_ids = results.otu_ids;
        var otu_labels = results.otu_labels;   
        
           
        var trace = {
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            name: "Greek",
            type: "bar",
            orientation: "h"
        };
        var data = [trace];
        var layout = {
            title: "Top Ten OTUs for Individual ",
            //margin: {l: 100, r: 100, t: 100, b: 100},
            
        }; 
   
    Plotly.newPlot("bar",data,layout);
    });
}


        

function bubbleGraphDraw(id_num){
    
    // Draw the Bubble Chart

    d3.json(url).then((data) => {
        var selectionID = data.samples;
        var filterRow = selectionID.filter(row => row.id == id_num);
        var results = filterRow[0];
        var sample_values = results.sample_values;
        var otu_ids = results.otu_ids;
        var otu_labels = results.otu_labels;   
        var trace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
            size: sample_values,
            color: otu_ids,
            colorscale:"Portland"
            }
        };
        var bubbleData = [trace];
        var layout = {
            showlegend: false,
            hovermode: 'closest',
            xaxis: {title:"OTU ID"},
        };
        Plotly.newPlot('bubble', bubbleData, layout); 
    });    
}
        // Draw the Gauge Chart
function gaugeGraphDraw(id_num){

    //Plotly.restyle("gauge", data, layout);

}
function optionChanged(selection){
    
        demographyTable(selection);
        barGraphDraw(selection);
        bubbleGraphDraw(selection);
        gaugeGraphDraw(selection);
}
  
init();
