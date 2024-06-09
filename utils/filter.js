const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const fastCsv = require('fast-csv');

const MAX_RECORDS_PER_FILE = 20;

module.exports = async (directory, startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start) || isNaN(end)) {
        console.error('Invalid date format. Please use RFC3339 format.');
        process.exit(1);
    }

    let csvFiles = await getCsvFiles(directory);
    if (csvFiles.length === 0) {
        await generateCsvFiles(directory);
        csvFiles = await getCsvFiles(directory);
    }

    const filteredData = [];

    for (const file of csvFiles) {
        const filePath = path.join(directory, file);

        await new Promise((resolve, reject) => {
            let recordsCount = 0;

            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on('data', (row) => {
                    // console.log(row);
                    if (isWithinDateRange(row.TrxDate, start, end)) {
                        if (recordsCount < MAX_RECORDS_PER_FILE) {
                            filteredData.push(row);
                            console.log(row);
                        }
                        recordsCount++;
                    }
                })
                .on('end', () => {
                    resolve();
                })
                .on('error', (err) => {
                    reject(`Error reading file ${file}: ${err.message}`);
                });
        });
        
    }
    
    if (filteredData.length === 0) {
        console.error(`No transactions found within the specified date range.`);
        process.exit(1);
    }

    console.log(`Found ${filteredData.length} transactions within the specified date range.`);
    
    writeFilteredData(output, filteredData);
};

function getCsvFiles(directory) {
    return new Promise((resolve, reject) => {
        fs.readdir(directory, (err, files) => {
            if (err) {
                reject(`Error reading directory: ${err.message}`);
            } else {
                const csvFiles = files.filter(file => path.extname(file).toLowerCase() === '.csv');
                resolve(csvFiles);
            }
        });
    });
}

function generateCsvFiles(directory) {
    return new Promise((resolve, reject) => {
        const promises = [];
        for (let i = 0; i < 3; i++) { // Generate 3 CSV files
            promises.push(new Promise((resolve) => {
                const filePath = path.join(directory, `transactions_${i + 1}.csv`);
                const ws = fs.createWriteStream(filePath);
                const csvStream = fastCsv.format({ headers: true });
                csvStream.pipe(ws);

                for (let j = 0; j < Math.floor(Math.random() * MAX_RECORDS_PER_FILE) + 1; j++) {
                    csvStream.write({
                        TrxNo: i * MAX_RECORDS_PER_FILE + j + 1,
                        TrxDate: getRandomDate(),
                        TrxDetail: `Transaction ${i * MAX_RECORDS_PER_FILE + j + 1}`,
                        Amount: getRandomAmount()
                    });
                }

                csvStream.end();
                ws.on('finish', () => resolve());
            }));
        }
        Promise.all(promises).then(() => resolve());
    });
}

function getRandomDate() {
    const start = new Date(2022, 0, 1); // Start date
    const end = new Date(2023, 11, 31); // End date
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomAmount() {
    return Math.floor(Math.random() * 1000) + 1; // Random amount between 1 and 1000
}

function isValidTransaction(transaction) {
    return (
        Number.isInteger(transaction.TrxNo) &&
        transaction.TrxDate instanceof Date &&
        typeof transaction.TrxDetail === 'string' &&
        Number.isInteger(transaction.Amount)
    );
}

function isWithinDateRange(date, start, end) {
    return date >= start && date <= end;
}

function writeFilteredData(outputPath, data) {
    const ws = fs.createWriteStream(outputPath);
    fastCsv
        .write(data, { headers: true })
        .pipe(ws)
        .on('finish', () => {
            console.log(`Filtered data written to ${outputPath}`);
        })
        .on('error', (err) => {
            console.error(`Error writing to file: ${err.message}`);
        });
}