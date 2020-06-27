const headers = [
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
let usersParsed;
const createTable = (headers, body) => {
	//Aca tengo dudas de identacion. Ademas ví que en el ejemplo vos lo hiciste con un array
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
const createHeaders = (headers) => {
	return headers.map(({text}) => `<th scope="col">${text}</th>`).join('');
};
const createBody = (users) => {
	return users.map((user) => {
		return `<tr>
			${Object.values(user).map((value, index) => {
				//duda de indentacion
				return `
					<${index === 0 ? 'th scope="row"' : 'td'}>
						${value}
					</td>
					`;
			}).join('')}
		</tr>
		`
	}).join('');
};
const clearTableBody = (tableBodyContainer) => {
	tableBodyContainer.innerHTML = '';
};
const getTableBodyContainer = () => {
	return tableContainer.getElementsByTagName('tbody')[0];
};
const renderGrid = (users) => {
	const bodyContainer = getTableBodyContainer();
	clearTableBody(bodyContainer);
	if (!users) return
	bodyContainer.innerHTML = createBody(users);
};
const getParsedUsers = (users) => {
	return users.map(({givenName, familyName, age}) => {
		return {
			givenName:  givenName,
			familyName: familyName,
			age: age,
			initials: getInitials(givenName, familyName),
			legalAge: getLegalAge(age),
		};
	});
};
const getLegalAge = (age) => {
	return parseInt(age) >= 18 ? 'yes' : 'no';
};
const getInitials = (givenName, familyName) => {
	return [
		...givenName.split(' '), 
		...familyName.split(' ')
	].map(name => name.charAt(0)).join('');
};
const initFilters = (headers, users) => {
	initSelect(headers);
	inputSearch.addEventListener('input', (e) => {
		onInputSearchChange(e, users);
	});
};
const onInputSearchChange = (e, users) => {
	const parsedUsers = getParsedUsers(users);
	const filterUsers = getFilterUsers(
		e.currentTarget.value, 
		parsedUsers, 
		selectColumns.value
	);

	if (filterUsers.length) {
		renderGrid(filterUsers);
	} else if (e.currentTarget.value.length === 0) {
		renderGrid(parsedUsers);
	} else {
		renderGrid(null);
	};
};
const getFilterUsers = (searchString, users, selectedColumn) => {
	return users.filter( user => 
		String(user[selectedColumn])
		.toLowerCase()
		.search(searchString.toLowerCase()) >= 0 
		? user 
		: null 
	);	
};
const initSelect = (headers) => {
	selectColumns.innerHTML = headers.map(({value, text}) => `<option value="${value}">${text}</option>`).join('');
};
const init = () => {
	//esto me explotó la cabeza. tableContainer no necesita del metodo getElementById, con nombrarlo ya existe!!!
	tableContainer.innerHTML = createTable(
		createHeaders(headers),
		createBody(getParsedUsers(users))
	);
	initFilters(
		headers,
		users
	);
};
init();
