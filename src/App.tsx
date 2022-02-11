import {useEffect, useState, KeyboardEvent, MouseEvent} from 'react';
import './App.css';
import config from './config.json';
import axios from 'axios';

function App(): JSX.Element {
	interface ListItem {
		name: string;
		image?: {url?: string};
		country_codes: string;
		life_span: string;
		description: string;
	}

	const [catList, setCatList] = useState<ListItem[]>([]);
	const [targetCatList, setTargetCatList] = useState<ListItem[]>([]);
	const [targetValue, setTargetValue] = useState<string>('');

	useEffect(() => {
		axios
			.get(`${config.BASE_URL}breeds`)
			.then((res) => {
				setCatList(res.data);
			})
			.catch((e) => console.error(e));
	}, []);

	function searching() {
		let nameList: string[] = catList.map((cur) => cur.name);
		nameList = nameList.filter((cur) => cur.includes(targetValue));
		let targetCats: ListItem[] = [];
		for (let i: number = 0; i < nameList.length; i++) {
			let target: ListItem[] = catList.filter((cur) => cur.name === nameList[i]);
			targetCats.push(target[0]);
		}
		setTargetCatList(targetCats);
		//초기화
		setTargetValue('');
		let text = document.querySelector('#search_bar') as Element;
		let textContent = text.textContent as string;
		textContent = '';
		console.log(textContent);
	}

	const handleEnterEvent = (e: KeyboardEvent<HTMLInputElement>) => {
		let innerText = e.target as HTMLInputElement;
		console.log(innerText.value);
		setTargetValue(innerText.value);

		if (e.code === 'Enter') {
			if (targetValue === '') {
				alert('고양이 이름을 입력해 주세요');
				return;
			} else {
				searching();
				console.log(targetValue);
			}
		} else {
			return;
		}
	};
	const handleClickEvent = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
		if (targetValue === '') {
			alert('고양이 이름을 입력해 주세요');
		} else {
			searching();
		}
	};

	return (
		<div className="App">
			<div className="search_box">
				<h1>THE CAT SEARCH</h1>
				<input type="search" id="search_bar" placeholder="search about the cat" onKeyUp={(e) => handleEnterEvent(e)} />
				<button onClick={(e) => handleClickEvent(e)}>search</button>
			</div>
			<ul className="result_box">
				{targetCatList.map((cur, idx) => (
					<li key={idx}>
						<dl>
							<dt>{cur.name}</dt>
							<dd>
								<img src={cur.image?.url} alt={cur.name} />
							</dd>
							<dd>country_codes : {cur.country_codes}</dd>
							<dd>life_span : {cur.life_span}</dd>
							<dd>{cur.description}</dd>
						</dl>
					</li>
				))}
			</ul>
		</div>
	);
}

export default App;
