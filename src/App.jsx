import {useEffect, useState} from 'react';
import './App.css';
import config from './config.json';
import axios from 'axios';

function App() {
	const [catList, setCatList] = useState([]);
	const [targetValue, setTargetValue] = useState('');
	const [targetCatList, setTargetCatList] = useState([]);

	useEffect(() => {
		axios
			.get(`${config.BASE_URL}breeds`)
			.then((res) => {
				setCatList(res.data);
			})
			.catch((e) => console.error(e));
	}, []);

	const handleEvent = () => {
		if (targetValue === '') {
			alert('고양이 이름을 입력해 주세요');
		}
		let nameList = catList.map((cur) => cur.name);
		nameList = nameList.filter((cur) => cur.includes(targetValue));
		let targetCats = [];
		for (let i = 0; i < nameList.length; i++) {
			let target = catList.filter((cur) => cur.name === nameList[i]);
			targetCats.push(target[0]);
		}
		setTargetCatList(targetCats);
	};

	return (
		<div className="App">
			<div className="search_box">
				<h1>THE CAT SEARCH</h1>
				<input type="search" placeholder="search about the cat" onInput={(e) => setTargetValue(e.target.value)} />
				<button onClick={handleEvent}>search</button>
			</div>
			<ul className="result_box">
				{targetCatList.map((cur, idx) => (
					<li key={idx}>
						<dl>
							<dt>{cur.name}</dt>
							<dd>
								<img src={cur.image.url} alt={cur.name} />
							</dd>
							<dd>{cur.country_codes}</dd>
							<dd>{cur.life_span}</dd>
							<dd>{cur.description}</dd>
						</dl>
					</li>
				))}
			</ul>
		</div>
	);
}

export default App;
