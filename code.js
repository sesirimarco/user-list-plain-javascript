const users = [
	{
		givenName: 'Pedro',
		familyName: 'Perez Gonzalez',
		age: 72
	},
	{
		givenName: 'Santa María',
		familyName: 'Sanchez',
		age: 15
	},
	{
		givenName: 'Carlos',
		familyName: 'Bertincci Prosperi',
		age: 36
	},
	{
		givenName: 'Sebastian',
		familyName: 'Sirimarco',
		age: 36
	}

];
headers = [
	{
		text: 'Given name', 
		value: 'givenName',
	},
	{
		text: 'Family name', 
		value: 'familyName',
	},
	{
		text: 'Age', 
		value: 'age',
	},
	{
		text: 'Initials', 
		value: 'initials',
	},
	{
		text: 'Legal age', 
		value: 'legalAge',
	},
];
class Commons {
	getElement(id) {
		return document.getElementById(id);
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
class Table {
	constructor(users, headers, commons) {
		this.users = users;
		this.headers = headers;
		this.commons = commons;
		this.container = 'userTable';

		this.render();
	};
	render() {
		this.commons.getElement(this.container)
			.innerHTML = this.createTable(
				this.createHeaders(this.headers),
				this.createBody(
					this.commons.getParsedUsers(this.users)
				)
		);
	};
	getTableBodyContainer() {
		return this.commons.getElement(this.container).querySelector('tbody');
	};
	update(users) {
		const bodyContainer = this.getTableBodyContainer();
		this.clearTableBody(bodyContainer);
		if (users) {
			bodyContainer.innerHTML = this.createBody(users);
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
	createBody(users) {
		return users.map((user) => {
			return `
				<tr>
					${Object.values(user).map((value, index) => {
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
	constructor(users, table, headers, commons) {
		this.table = table;
		this.commons = commons;
		
		this.render(this.commons.getElement('filters'));
		this.initSelect(headers, this.commons.getElement('selectColumns'));
		this.commons.getElement('inputSearch')
			.addEventListener('input', (e) => {
				this.updateValueFilter(e.currentTarget.value, users);
			});
	};
	updateValueFilter(search, users) {
		const parsedUsers = this.commons.getParsedUsers(users);
		const filterUsers = this.getFilterUsers(
			search, 
			parsedUsers, 
			selectColumns.value
		);
		this.table.update(filterUsers ? filterUsers : parsedUsers);
	};
	getFilterUsers(searchString, users, selectedColumn) {
		return users.filter( user => 
			String(user[selectedColumn])
			.toLowerCase()
			.search(searchString.toLowerCase()) >= 0 
				? user 
				: null 
		);	
	};
	initSelect(headers, selectColumns) {
		selectColumns.innerHTML = headers
			.map(({value, text}) => `<option value="${value}">${text}</option>`)
			.join('');
	};
	render(container) {
		container.innerHTML = `
			<select 
				id="selectColumns" 
				class="form-control">
			</select>
			<input 
				type="text" 
				id="inputSearch" 
				placeholder="Search..."  
				class="form-control"
			/>  
		`;
	}
};
const init = () => {
	const commons = new Commons();
	new Filters(
		users,
		new Table(
			users, 
			headers, 
			commons
		),
		headers,
		commons
	);
};
init();
