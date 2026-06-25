const LoadMoreButton = ({ onClick, isLoading }) => {
    return (
        <div className={'text-center'}>
            <button
                onClick={onClick}
                className={`dark:bg-primaryDark bg-primary hover:bg-blue-600 dark:text-dark font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out  ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isLoading}
            >
                {isLoading ? (
                    <svg
                        className="animate-spin inline-block h-5 w-5 dark:text-dark text-light"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                ) : (
                    'Load More'
                )}
            </button>
        </div>
    );
};

export default LoadMoreButton;
