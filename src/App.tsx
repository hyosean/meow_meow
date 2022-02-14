import {useEffect, useState, KeyboardEvent, useCallback, useRef} from 'react';
import './App.css';
import catrun from './gif/loading.gif';
import config from './config.json';
import axios from 'axios';

interface ListItem {
	name: string;
	image?: {url?: string};
	country_codes: string;
	life_span: string;
	description: string;
}

function App(): JSX.Element {
	const [catList, setCatList] = useState<ListItem[]>([]);
	const [targetCatList, setTargetCatList] = useState<ListItem[]>([]);
	const searchInputRef = useRef<HTMLInputElement>(null);

	const getData = useCallback(async () => {
		try {
			const url = `${config.BASE_URL}breeds`;
			const res = await axios.get(url);
			setCatList(res.data);
		} catch (err) {
			console.error(err);
		}
	}, []);

	useEffect(() => {
		getData();
	}, [getData]);

	function searching() {
		let nameList: string[] = catList.map((cur) => cur.name);
		nameList = nameList.filter((cur) => cur.includes(searchInputRef.current!.value));
		let targetCats: ListItem[] = [];
		for (let i: number = 0; i < nameList.length; i++) {
			let target: ListItem[] = catList.filter((cur) => cur.name === nameList[i]);
			targetCats.push(target[0]);
		}
		setTargetCatList(targetCats);
		//초기화
		searchInputRef.current!.value = '';
	}

	const handleEnterEvent = (e: KeyboardEvent<HTMLInputElement>) => {
		const innerText = e.target as HTMLInputElement;
		// setTargetValue(innerText.value);
		console.log(innerText.value);

		if (e.code === 'Enter') {
			if (searchInputRef.current!.value === '' || searchInputRef.current!.value === null) {
				alert('고양이 이름을 입력해 주세요');
			} else {
				searching();
			}
		}
	};
	const handleClickEvent = () => {
		if (searchInputRef.current!.value === '') {
			alert('고양이 이름을 입력해 주세요');
		} else {
			searching();
		}
	};

	return (
		<div className="App">
			<div className="search_box">
				<h1>THE CAT SEARCH</h1>
				<input
					ref={searchInputRef}
					type="search"
					placeholder="search about the cat"
					autoFocus
					onKeyUp={(e) => handleEnterEvent(e)}
				/>
				<button onClick={handleClickEvent}>search</button>
			</div>
			<ul className="result_box">
				{targetCatList.length !== 0 ? (
					targetCatList.map((cur, idx) => (
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
					))
				) : (
					<img className="frist_img" src={catrun} alt="초기 화면" />
				)}
			</ul>
		</div>
	);
}

export default App;
