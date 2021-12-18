const fs = require('fs');
  
const args = process.argv;

const currentWorkingDirectory = args[1].slice(0, -7);

let sorted = [];

// Making of files if they do not already exist
if (fs.existsSync(currentWorkingDirectory + 'task.txt') === false) {
    let createStream = fs.createWriteStream('task.txt');
    createStream.end();
  }
if (fs.existsSync(currentWorkingDirectory + 'completed.txt') === false) {
    let createStream = fs.createWriteStream('completed.txt');
    createStream.end();
  }

// Function to print the help instructions
const Instruction = () => {
    const ins = `Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`;
console.log(ins);
  };

  const addTask = () => {
    let newTask = args.splice(4).join(" ");
    const p = args[3];
      
    // If argument is passed
    if (newTask) { 
      
        // Read the data from file task.txt and convert it into string
        let fileData = fs.readFileSync(currentWorkingDirectory + 'task.txt').toString(); 

        // Convert the string to array   
        fileData = fileData.split("\n");  

        // Filter the data for any empty lines
        fileData = fileData.filter(function (value) {
        return value !== ''; 
        });
        
        // Add newTask to fileData according to priority
        let f=0;
        if(fileData.length === 0){fileData.push(`${p} ${newTask}`)}
        else{
        for(let i=0; i<fileData.length; i++){
            let a = fileData[i];
            a = a.split(" ");
            let c = parseInt(a[0]);
            if(c > p){
                f = 1;
                fileData.splice(i, 0, `${p} ${newTask}`);
                break;
            }
        }
        if(f === 0){fileData.push(`${p} ${newTask}`)}
    }

    // Join array to form a string
        fileData = fileData.join("\n")

        // Add string to the task.txt
        fs.writeFile(currentWorkingDirectory + 'task.txt', fileData, 
          
        function (err) {
    
          // Handle if there is any error
          if (err) throw err; 
            
          // Logs the new task added
          console.log(`Added task: \"${newTask}\" with priority ${p}`); 
        },
      );
    }
    
    else { 
      console.log("Error: Missing tasks string. Nothing added!");
    }
  };

  // Function to delete the task
  const deleteTask = () => {
  
    // Store which index is passed
    const deleteIndex = args[3]; 
      
    // If index is passed
    if (deleteIndex) { 
      
      // Create a empty array
      let data = []; 
        
      // Read the data from file and convert it into string
      let fileData = fs.readFileSync(currentWorkingDirectory + 'task.txt').toString(); 
          
      data = fileData.split('\n');
        
      // Filter the data for any empty lines
      let filterData = data.filter(function (value) {
        return value !== ''; 
      });
        
      // If delete index is greater than no. of task or less than zero
      if (deleteIndex > filterData.length || deleteIndex <= 0) {
        console.log(
          'Error: task with index #' + deleteIndex + ' does not exist. Nothing deleted.',
        );   
      } else {
    
        // Remove the task
        filterData.splice(deleteIndex-1, 1); 
          
        // Join the array to form a string
        const newData = filterData.join('\n'); 
          
        // Write the new data back in file
        fs.writeFile(
          currentWorkingDirectory + 'task.txt',
          newData, 
          function (err) {
            if (err) throw err;
    
            // Logs the deleted index
            console.log('Deleted task #'+ deleteIndex); 
          },
        );
      }
    } else { console.log("Error: Missing NUMBER for deleting tasks.");
    }
  };

  // Function to mark task as done
  const doneFunction = () => {
  
    // Store the index passed as argument
    const completedIndex = args[3]; 
      
    // If argument is passed
    if (completedIndex) { 
      
      // Empty array
      let data = []; 
        
      // Create a new date object
      let dateobj = new Date(); 
        
      // Read the data from task.txt
      const fileData = fs
        .readFileSync(currentWorkingDirectory + 'task.txt')
        .toString(); 
        
      // Read the data from completed.txt
      const completedData = fs
        .readFileSync(currentWorkingDirectory + 'completed.txt')
        .toString(); 
          
      // Split the task.txt data
      data = fileData.split('\n'); 
        
      // Filter for any empty lines
      let filterData = data.filter(function (value) {
        return value !== '';
      }); 
        
      // If completed index is greater than no. of task or <=0
      if (completedIndex > filterData.length || completedIndex <= 0) {
        console.log('Error: no incomplete item with index #' 
            + completedIndex + ' exists.');
      } else {
    
        // Delete the task from task.txt
        const deleted = filterData.splice(completedIndex-1, 1);
          
        // Join the array to create a string
        const newData = filterData.join('\n'); 
          
        // Write back the data in task.txt
        fs.writeFile(currentWorkingDirectory + 'task.txt',newData, function (err) {
            if (err) throw err;
          },
        );
          
        // Write the stored task in completed.txt
        // along with date string
        fs.writeFile(currentWorkingDirectory + 'completed.txt', deleted + '\n' + completedData,function (err) {
            if (err) throw err;
            console.log('Marked item as done.');
          },
        );
      }
    } else { console.log("Error: Missing NUMBER for marking tasks as done.");
    }
  };

  // Function to show the pending as well as completed tasks
  const reportFunction = () => {
  
    // Create empty array for data of task.txt
    let taskData = [];
  
    // Create empty array for data of completed.txt
    let completedData = [];

  
    // Read data from both the files
    const task = fs.readFileSync(currentWorkingDirectory
                + 'task.txt').toString();
    const completed = fs.readFileSync(currentWorkingDirectory
                + 'completed.txt').toString();
  
    // Split the data from both files
    taskData = task.split('\n');
  
    completedData = completed.split('\n');
    let filtertaskData = taskData.filter(function(value) {
        return value !== '';
    });
  
    let filtercompletedData = completedData.filter(function(value) {
  
        return value !== '';
    });
  
    console.log('Pending : ' + filtertaskData.length)
    for (let i = 0; i < filtertaskData.length; i++) {
        let dd = filtertaskData[i].split(" ");
        let pr = dd[0];
        let nt = dd.slice(1);
        nt = nt.join(" ");
        console.log((i+1) + '. ' + `${nt} [${pr}]` +"\n");
    }
    console.log('Completed : ' + filtercompletedData.length);
    for (let i = 0; i < filtercompletedData.length; i++) {
        let dd = filtercompletedData[filtercompletedData.length - 1 - i].split(" ");
        let pr = dd[0];
        let nt = dd.slice(1);
        nt = nt.join(" ");
        console.log((i+1) + '. ' + `${nt}`);
    }
};

// Function to list the pending task according to priority
const listFunction = () => {
  
    // Create a empty array
    let data = []; 
      
    // Read from todo.txt and convert it
    // into a string
    const fileData = fs.readFileSync(currentWorkingDirectory + 'task.txt').toString(); 
      
    // Split the string and store into array
    data = fileData.split('\n'); 
      
    // Filter the string for any empty lines in the file
    let filterData = data.filter(function (value) {
      return value !== '';
    }); 
      
    if (filterData.length === 0) {
      console.log('There are no pending tasks!');
    }
      
    for (let i = 0; i < filterData.length; i++) {
        let dd = filterData[i].split(" ");
        let pr = dd[0];
        let nt = dd.slice(1);
        nt = nt.join(" ");
      console.log((i+1) + '. ' + `${nt} [${pr}]`);
    }
  };
  
  switch (args[2]) {
    case 'add': {
      addTask();
      break;
    }
    
    case 'ls': {
      listFunction();
      break;
    }
    
    case 'del': {
      deleteTask();
      break;
    }
      
    case 'done': {
      doneFunction();
      break;
    }
      
    case 'help': {
      Instruction();
      break;
    }
      
    case 'report': {
      reportFunction();
      break;
    }
      
    default: {
      Instruction();
      // We will display help when no 
      // argument is passed or invalid
      // argument  is passed
    }
  }