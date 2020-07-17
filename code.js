import { 
	users, 
	usersHeaders, 
	vegetables, 
	vegetablesHeaders 
} from './mock.js';

//it's simulating an external module.
const getElement = (id) => {
	return document.getElementById(id);
};
class Table {
	constructor(items, headers, container, id) {
		this.items = items;
		this.headers = headers;
		this.container = container;
		this.id = id;

		this.render();
	};
	render() {
		getElement(this.container)
			.insertAdjacentHTML('afterend', 
			`
				<div class="row">
            		<div class="col-12">
						<div id="table${this.id}">
						${
							this.createTable(
									this.createHeaders(this.headers),
									this.createBody(
										this.items
									)
							)
						}
						</div>    
					</div>
				</div>
			`
		);
	};
	getTableBodyContainer() {
		return getElement(`table${this.id}`).querySelector('tbody');
	};
	update(items) {
		const bodyContainer = this.getTableBodyContainer();
		this.clearTableBody(bodyContainer);
		if (items) {
			bodyContainer.innerHTML = this.createBody(items);
		};
	};
	createTable(headers, body) {
		return `
			<table class="table">
				<thead class="thead-dark">
					<tr>
						${headers}
					</tr>
				</thead>
				<tbody>
					${body}
				</tbody>
			</table>
		`;
	}
	createHeaders(headers) {
		return headers.map(({text}) => `<th scope="col">${text}</th>`).join('');
	};
	createBody(items) {
		return items.map((item) => {
			return `
				<tr>
					${Object.values(item).map((value, index) => {
						return `
							<${index === 0 ? 'th scope="row"' : 'td'}>
								${value}
							</td>
							`;
					}).join('')}
				</tr>
			`;
		}).join('');
	};
	clearTableBody(tableBodyContainer) {
		tableBodyContainer.innerHTML = '';
	};
};
class Filters {
	constructor(filteredTable, items, headers, container, id) {
		this.filteredTable = filteredTable;
		this.items = items
		this.headers = headers;
		this.id = id;
		this.render(getElement(container));
	};
	updateValueFilter(search, items) {
		const parsedItems = items;
		const filterItems = this.getFilterItems(
			search, 
			parsedItems, 
			this.selectColumns.value
		);
		this.filteredTable.handlerChangeFilter(
				filterItems 
					? filterItems 
					: parsedItems
			);
	};
	getFilterItems(searchString, items, selectedColumn) {
		return items.filter( item => 
			String(item[selectedColumn])
			.toLowerCase()
			.search(searchString.toLowerCase()) >= 0 
				? item 
				: null 
		);	
	};
	initSelect(selectColumns, headers) {
		selectColumns.innerHTML = headers
			.map(({value, text}) => `<option value="${value}">${text}</option>`)
			.join('');
	};
	render(container) {
		container.insertAdjacentHTML(
				'afterBegin', 
				`
					<div class="row justify-content-end">
						<div 
							id="filters${this.id}" 
							class="input-group col-sm-12 col-md-6 col-lg-4"
						>
						<select 
							id="selectColumns${this.id}" 
							class="form-control">
						</select>
						<input 
							type="text" 
							id="inputSearch${this.id}" 
							placeholder="Search..."  
							class="form-control"
						/>  
						</div>
					</div>
					<br />
				`
		);

		this.selectColumns = getElement(`selectColumns${this.id}`);
		this.initSelect(this.selectColumns , this.headers);
		getElement(`inputSearch${this.id}`)
			.addEventListener('input', (e) => {
				this.updateValueFilter(e.currentTarget.value, this.items);
			});
	};
};
class FilteredTable {
	constructor(container, id, items, headers) {
		this.table = new Table(
			items, 
			headers, 
			container,
			id
		);
		this.filters = new Filters(
			this,
			items,
			headers,
			container,
			id
		)
	};
	handlerChangeFilter(items) {
		this.table.update(items);
	};
};
class UsersFilteredTable {
	constructor(container, id, users, headers) {
		new FilteredTable(
			container,
			id,
			this.getParsedUsers(users),
			headers
		);
	};
	getParsedUsers(users) {
		return users.map(({givenName, familyName, age}) => {
			return {
				givenName:  givenName,
				familyName: familyName,
				age: age,
				initials: this.getInitials(givenName, familyName),
				legalAge: this.getLegalAge(age),
			};
		});
	};
	getLegalAge(age) {
		return parseInt(age) >= 18 ? 'yes' : 'no';
	};
	getInitials(givenName, familyName) {
		return [
			...givenName.split(' '), 
			...familyName.split(' ')
		].map(name => name.charAt(0)).join('');
	};
};
class VegetablesFilteredTable {
	constructor(container, id, vegetables, headers) {
		new FilteredTable(
			container,
			id,
			this.getParsedVegetables(vegetables),
			headers
		);
	};
	getParsedVegetables(vegetables) {
		return vegetables.map(({name, origin, cost, kilos}) => {
			return {
				name,
				origin,
				cost,
				kilos,
				totalCost: `$ ${this.getTotalCost(kilos, cost)}`

			};
		});
	};
	getTotalCost(kilos, cost) {
		return kilos * cost;
	};
};
const init = () => {
	new UsersFilteredTable(
		'filteredTableUsers', 
		'Users',
		users,
		usersHeaders
	);
	new VegetablesFilteredTable(
		'filteredTableVegetables', 
		'Vegetables',
		vegetables,
		vegetablesHeaders
	);
};
init();