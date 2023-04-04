import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
	const [destination, setDestination] = useState('');
	const [loading, setLoading] = useState(false);
	const [answer, setAnswer] = useState([]);
	const [numDays, setNumDays] = useState(1);
	const options = ['Adventure', 'Shopping', 'Chill', 'Art', 'Nature'];
	const [selectedOptions, setSelectedOptions] = useState([]);

	const handleOptionToggle = (option) => {
		const index = selectedOptions.indexOf(option);
		if (index === -1) {
			setSelectedOptions((s) => [...s, option]);
		} else {
			setSelectedOptions([
				...selectedOptions.slice(0, index),
				...selectedOptions.slice(index + 1),
			]);
		}
	};

	const buildStringFromArray = (arr) => {
		let str = '';
		for (let i = 0; i < arr.length; i++) {
			if (i == arr.length - 1) {
				str += `${arr[i]}`;
			} else {
				str += `${arr[i]}, `;
			}
		}
		return str;
	};

	const formatText = (str) => {
		let finalAns = [];
		for (let i = 0; i <= numDays; i++) {
			let ans = str.search('Day');
			if (ans == -1) {
				finalAns.push(str);
				break;
			}
			let slicedStr = str.slice(0, ans);
			finalAns.push(slicedStr);

			str = str.substr(ans + 3, str.length);
		}
		return finalAns;
	};

	const onSubmit = async (e) => {
		setLoading(true);
		e.preventDefault();
		if (numDays < 1 || numDays > 5) {
			alert('Please keep the days limited to 5 days for better response');
		}
		let likes = buildStringFromArray(selectedOptions);
		let query = `Give me a travel itinerary to ${destination} for ${numDays} days. I like ${likes}. Suggest me some restaurants too in the end. I want to you to talk like Munna bhai from the Bollywood movie while giving me the info.Try your best to be hilarious and be sarcastic.`;
		let _body = {
			model: 'gpt-3.5-turbo',
			messages: [{ role: 'user', content: query }],
		};

		try {
			let _result = await fetch('https://api.openai.com/v1/chat/completions', {
				method: 'POST',
				headers: {
					//prettier-ignore
					"Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(_body),
			});
			let result = await _result.json();
			let finalAns = formatText(result.choices[0].message.content);

			setAnswer(finalAns);
		} catch (error) {
			console.log(error);
		}
		setLoading(false);
	};

	const addToActivites = (e) => {
		const found = selectedOptions.find((element) => e.target.value === element);
		if (found) {
			return;
		}
		setSelectedOptions((s) => [...s, e.target.value]);
	};
	return (
		<div className='flex flex-col items-center justify-center bg-gray-900 text-white min-h-screen'>
			<Head>
				<title>TravelGPT</title>
				<meta name='description' content='TravelGPT website' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className='max-w-2xl mx-auto py-8 px-4 flex flex-col items-center'>
				<h1 className='text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text text-center mb-8'>
					TravelGPT
				</h1>
				<p className='my-4 text-center'>
					TravelGPT is your one-stop destination for travel planning. With our
					cutting-edge technology powered by GPT-3, we help you plan your dream
					vacation with ease. Simply enter your desired destination and number
					of days to travel, and our advanced algorithm will generate a
					personalized itinerary tailored to your preferences. <br /> We've
					given a twist by adding the "Munna bhai" touch 😉
					<br />
					<br />
				</p>
				{!loading && answer.length === 0 && <img src='/nahi.gif' alt='' />}
				{!loading && answer.length === 0 && (
					<form className='my-5 w-3/5 mx-auto' onSubmit={onSubmit}>
						<div className='mb-4'>
							<label htmlFor='destination' className='block mb-2 font-bold'>
								Destination
							</label>
							<input
								type='text'
								id='destination'
								placeholder='Goa'
								className='text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500'
								value={destination}
								onChange={(e) => setDestination(e.target.value)}
							/>
						</div>
						<div className='mb-4'>
							<label htmlFor='days' className='block mb-2 font-bold'>
								Number of days
							</label>
							<input
								type='number'
								id='days'
								min={1}
								max={5}
								step='any'
								placeholder='1'
								className='text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500'
								value={numDays}
								onChange={(e) => setNumDays(Number(e.target.value))}
							/>
						</div>
						<div className='flex flex-col mb-4'>
							<h3 className='block mb-2 font-bold'>Activities</h3>
							{selectedOptions.length > 0 && (
								<ul className=' '>
									{selectedOptions.map((option) => (
										<li
											key={option}
											className='inline-flex items-center px-2.5 py-0.5 rounded-md bg-pink-500 text-white mr-2 mb-2'>
											<span>{option}</span>
											<button
												type='button'
												className='flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
												onClick={() => handleOptionToggle(option)}>
												<span className='sr-only'>Remove {option}</span>
												<svg
													className='h-2 w-2'
													stroke='currentColor'
													fill='none'
													viewBox='0 0 8 8'>
													<path
														strokeLinecap='round'
														strokeWidth='1.5'
														d='M1 1l6 6m0-6L1 7'
													/>
												</svg>
											</button>
										</li>
									))}
								</ul>
							)}
							<select
								multiple
								className='text-black block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none sm:text-sm rounded-md'
								value={selectedOptions}
								onChange={(e) => addToActivites(e)}>
								{options.map((option) => (
									<option
										key={option}
										value={option}
										className='border-b border-gray-200 py-2 hover:cursor-pointer'>
										{option}
									</option>
								))}
							</select>
						</div>
						<button
							type='submit'
							className='w-full bg-pink-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-pink-600'>
							Submit
						</button>
					</form>
				)}
				{loading && (
					<div role='status' className='flex justify-center mt-5'>
						<svg
							aria-hidden='true'
							className='w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-pink-600'
							viewBox='0 0 100 101'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
								fill='currentColor'
							/>
							<path
								d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
								fill='currentFill'
							/>
						</svg>
						<span className='sr-only'>Loading...</span>
					</div>
				)}
				{!loading && answer.length !== 0 && (
					<h1 className='text-2xl text-bold'>Your Answer :</h1>
				)}
				{!loading &&
					answer.length !== 0 &&
					answer.map((para) => {
						return (
							<p className='my-3 px-1' key={para}>
								{para}
							</p>
						);
					})}
				{!loading && answer.length !== 0 && (
					<button
						onClick={(e) => setAnswer([])}
						className='md:w-1/5 my-8 bg-pink-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-pink-600'>
						Try Again!
					</button>
				)}
			</main>
		</div>
	);
}
