function newGovernanceReportsLiquidity() {
    let thisObject = {
        addHTML: addHTML,
        initialize: initialize,
        finalize: finalize
    }

    return thisObject

    function initialize() {

    }

    function finalize() {

    }

    function addHTML(tabIndex, filters) {
        /*
        Parameters
        */
        let table = 'Liquidity'
        let programName = 'Liquidity Program'
        let programPropertyName = 'liquidityProgram'
        /*
        Setup Filters
        */
        let filtersObject
        if (filters !== undefined) {
            try {
                filtersObject = JSON.parse(filters)
            } catch (err) { }
        }
        /*
        Other Variables
        */
        let tableRecords = []
        let tableRecordDefinition = {
            "properties": [
                {
                    "name": "name",
                    "label": "User Profile",
                    "type": "string",
                    "order": "ascending",
                    "textAlign": "left"
                },
                {
                    "name": "market",
                    "label": "Market",
                    "type": "string",
                    "order": "ascending",
                    "textAlign": "center"
                },
                {
                    "name": "liquidityPower",
                    "label": "Liquidity Power",
                    "type": "number",
                    "order": "descending",
                    "textAlign": "center",
                    "format": "2 decimals"
                },
                {
                    "name": "percentage",
                    "label": "Percentage",
                    "type": "number",
                    "order": "descending",
                    "textAlign": "center",
                    "format": "percentage"
                },
                {
                    "name": "tokensAwarded",
                    "label": "Awarded",
                    "type": "number",
                    "order": "descending",
                    "textAlign": "center",
                    "format": "2 decimals"
                }
            ]
        }
        /*
        Here we get from the workspace all User Profiles.
        */
        let userProfiles = UI.projects.workspaces.spaces.designSpace.workspace.getHierarchyHeadsByNodeType('User Profile')
        /*
        Transform the result array into table records.
        */

        for (let j = 0; j < userProfiles.length; j++) {
            let userProfile = userProfiles[j]
            for (let j = 0; j < UI.projects.governance.globals.saToken.SA_TOKEN_BSC_PANCAKE_LIQUIDITY_ASSETS.length; j++) {
                let asset = UI.projects.governance.globals.saToken.SA_TOKEN_BSC_PANCAKE_LIQUIDITY_ASSETS[j]
                if (userProfile.tokenPowerSwitch === undefined) { continue }
                let program = UI.projects.governance.utilities.validations.onlyOneProgramBasedOnConfigProperty(userProfile, programName, 'asset', asset)
                if (program === undefined) { continue }
                if (program.payload === undefined) { continue }
                if (program.payload[programPropertyName] === undefined) { continue }

                let tableRecord = {
                    "name": userProfile.name,
                    "market": 'SA / ' + asset,
                    "liquidityPower": program.payload[programPropertyName].ownPower,
                    "percentage": program.payload[programPropertyName].awarded.percentage / 100,
                    "tokensAwarded": program.payload[programPropertyName].awarded.tokens | 0
                }

                if (UI.projects.governance.utilities.filters.applyFilters(filters, filtersObject, tableRecord) === true) {
                    tableRecords.push(tableRecord)
                }
            }
        }
        /*
        Get the sorting order for this table.
        */
        let sortingOrder = UI.projects.governance.spaces.reportsSpace.tablesSortingOrders[table]
        /*
        Set the default sorting order for this table.
        */
        if (sortingOrder === undefined) {
            UI.projects.governance.spaces.reportsSpace.tablesSortingOrders[table] = {
                property: 'tokensAwarded',
                order: 'descending'
            }
            sortingOrder = UI.projects.governance.spaces.reportsSpace.tablesSortingOrders[table]
        }
        return UI.projects.governance.utilities.tables.addHTML(
            table,
            tableRecords,
            tableRecordDefinition,
            sortingOrder,
            tabIndex
        )
    }
}