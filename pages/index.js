import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
	const [destination, setDestination] = useState('');
	const [numDays, setNumDays] = useState(0);
	const options = ['Adventure', 'Chill', 'Art'];
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

	const onSubmit = (e) => {
		e.preventDefault();
		console.log({ destination, numDays, activities });
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

			<main className='max-w-lg mx-auto py-8 px-4'>
				<h1 className='text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text text-center mb-8'>
					TravelGPT
				</h1>
				<p className='my-4 text-center'>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut quis
					tellus vel dolor interdum dignissim. Vivamus non justo non nulla
					iaculis efficitur. Sed in diam tortor. Duis nec quam velit. Ut sed
					risus vel urna venenatis scelerisque. Nullam tincidunt metus in sem
					auctor, ac bibendum nulla malesuada. Nulla facilisi. Nam consectetur
					ante non lorem sodales maximus.
				</p>
				<form className='my-4' onSubmit={onSubmit}>
					<div className='mb-4'>
						<label htmlFor='destination' className='block mb-2 font-bold'>
							Destination
						</label>
						<input
							type='text'
							id='destination'
							placeholder='Goa🌊'
							className='text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
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
							min='1'
							step='any'
							className='text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
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
									className='border-b border-gray-200 py-2'>
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
			</main>
		</div>
	);
}
