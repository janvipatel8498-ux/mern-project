import React from 'react';
import { FiStar } from 'react-icons/fi';

const Rating = ({ value, text, color = '#facc15' }) => {
    return (
        <div className='flex items-center gap-1'>
            <div className='flex items-center'>
                {[1, 2, 3, 4, 5].map((index) => (
                    <span key={index}>
                        <FiStar
                            className={`${value >= index
                                    ? 'fill-current text-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                        />
                    </span>
                ))}
            </div>
            {text && <span className='text-xs text-gray-500 dark:text-gray-400 ml-1'>{text}</span>}
        </div>
    );
};

export default Rating;
