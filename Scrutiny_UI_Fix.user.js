// ==UserScript==
// @name        Scrutiny UI Fix
// @homepageURL https://github.com/AlgoClaw/UImods/blob/main/Scrutiny_UI_Fix.user.js
// @downloadURL https://raw.githubusercontent.com/AlgoClaw/UImods/main/Scrutiny_UI_Fix.user.js
// @updateURL   https://raw.githubusercontent.com/AlgoClaw/UImods/main/Scrutiny_UI_Fix.user.js
// @match       *://*:8082/*
// @description null
// @version     0.001
//
// ==/UserScript==
//
async function getSummary() {
    try {
        const response = await fetch('/api/summary');
        const data = await response.json();
        return data;
    }
    catch (error) {
        throw new Error(error.message);
    }
}
async function getDetails(id) {
    try {
        const response = await fetch(`/api/device/${id}/details`);
        const data = await response.json();
        return data;
    }
    catch (error) {
        throw new Error(error.message);
    }
}
function humanizeBytes(bytes) {
    if (bytes === 0) {
        return '0 B';
    }
    const k = 1000;
    const dm = 2 < 0 ? 0 : 2;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
function humanizeTime(hours) {
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);
    if (years > 0) {
        return years + ' years';
    }
    if (days > 0) {
        return days + ' days';
    }
    return hours + ' hours';
}
function createTable(details) {
    function getFailureRate(smarts, id) {
        var _a;
        return ((_a = smarts[String(id)]) === null || _a === void 0 ? void 0 : _a.failure_rate) ? Math.round(smarts[String(id)].failure_rate * 100) + "%" : "";
    }
    function createHeaders(fields) {
        const tr = document.createElement('tr');
        fields.forEach(field => {
            const th = document.createElement('th');
            th.textContent = field;
            th.style.textAlign = "left";
            tr.append(th);
        });
        return tr;
    }
    function createRow(fields) {
        const tr = document.createElement('tr');
        fields.forEach(field => {
            const td = document.createElement('td');
            td.textContent = field;
            tr.append(td);
        });
        return tr;
    }
    const table = document.createElement('table');
    table.classList.add('mat-table', 'cdk-table', 'w-full', 'bg-transparent');
    const thead = document.createElement('thead');
    const tr = createHeaders([
        'Disk',
        'Status',
        'Temperature',
        'Capacity',
        'Device Model',
        'Powered On',
        'Reallocated Sectors',
        'Spin Retry',
        'Reallocated Event',
        'Current Pending Sector',
        'Offline Uncorrectable'
    ]);
    thead.append(tr);
    const tbody = document.createElement('tbody');
    details.forEach(detail => {
        const smart_attributes = detail.data.smart_results[0].attrs;
        const row = createRow([
            detail.data.device.device_name,
            detail.data.device.device_status === 0 ? 'Passed' : 'Failed',
            Math.round(detail.data.smart_results[0].temp * 1.8 + 32) + "°F",
            humanizeBytes(detail.data.device.capacity),
            detail.data.device.model_name,
            humanizeTime(detail.data.smart_results[0].power_on_hours),
            getFailureRate(smart_attributes, 5),
            getFailureRate(smart_attributes, 10),
            getFailureRate(smart_attributes, 196),
            getFailureRate(smart_attributes, 197),
            getFailureRate(smart_attributes, 198),
        ]);
        tbody.append(row);
    });
    table.append(thead, tbody);
    return table;
}
function sortDevices(details) {
    return details.sort((a, b) => {
        const aName = a.data.device.device_name;
        const bName = b.data.device.device_name;
        if (aName < bName) {
            return -1;
        }
        if (aName > bName) {
            return 1;
        }
        return 0;
    });
}
async function waitForClass(className) {
    return new Promise(resolve => {
        const interval = setInterval(() => {
            const elements = document.getElementsByClassName(className);
            if (elements.length > 0) {
                clearInterval(interval);
                resolve(elements[0]);
            }
        }, 100);
    });
}
async function main() {
    const summary = await getSummary();
    const deviceIds = Object.keys(summary.data.summary);
    var details = await Promise.all(deviceIds.map(id => getDetails(id)));
    details = sortDevices(details);
    const table = createTable(details);
    const tableDiv = document.createElement('div');
    tableDiv.classList.add('flex', 'flex-wrap', 'w-full');
    tableDiv.append(table);
    const referenceNode = await waitForClass('flex flex-wrap w-full ng-star-inserted');
    referenceNode === null || referenceNode === void 0 ? void 0 : referenceNode.before(tableDiv);
}
main();
