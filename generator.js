const fs = require('fs');
const path = require('path');

// const MAX_RECORDS_PER_FILE = 20;

module.exports = async (directory, startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (!isNaN(start) && !isNaN(end)) {
        if (end <= start) {
            console.error("EndTime must be greater than or equal to startTime");
        }
    }else{
        console.error('unable to filter the data : Invalid date format. Please use RFC3339 format.');
        process.exit(1);
    }   

    let csvFiles = await getCsvFiles(directory);
    const filteredData = [];

    for (const file of csvFiles) {
        const filePath = path.join(directory, file);
        const data = fs.readFileSync(filePath, "utf8").split("\n");

        data.forEach(line => {
            if(line.trim() !== "") {
                const [TrxNo, TrxDate, TrxDetail, Amount] = line.split(",");
                // console.log(TrxDate);
                if (isWithinDateRange(TrxDate, start, end)) {
                    filteredData.push(line);
                }
            }
            
        });
        // if (filteredData.length >= MAX_RECORDS_PER_FILE) break;
    }
    
    if (filteredData.length === 0) {
        console.error(`unable to filter the data : No transactions found within the specified date range.`);
        process.exit(1);
    }

    console.log(`Found ${filteredData.length} transactions within the specified date range.`);
    
    // const outputPath = getFilesName('D:/VSC/CLIApp/result', 'report.csv');
    const outputPath = path.join(process.cwd(), "report.csv");
    writeFilteredData(outputPath, filteredData);
};

function getCsvFiles(directory) {
    return new Promise((resolve, reject) => {
        fs.readdir(directory, (err, files) => {
            if (err) {
                reject(`unable to filter the data : ${err.message}`);
            } else {
                const csvFiles = files.filter(file => path.extname(file).toLowerCase() === '.csv');
                resolve(csvFiles);
            }
        });
    });
}

function isWithinDateRange(date, start, end) {
    const compareDate = new Date(date);
    return compareDate >= start && compareDate <= end;
}

function writeFilteredData(outputPath, data) {
    try {
        fs.writeFileSync(outputPath, data.join("\n"));
        console.log(`successfully filter the data`);
        process.exit(1);
    } catch (error) {
        printError(`Error writing to file: ${err.message}`);
    }
}

function getFilesName(directory, fileName) {
    let count = 1;
    let newFileName = path.join(directory, fileName);
    while (fs.existsSync(newFileName)) {
        newFileName = path.join(directory, `${count}_${fileName}`);
        count++;
    }

    return newFileName;
}