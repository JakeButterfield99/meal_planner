import SearchIcon from '@mui/icons-material/Search';

interface IProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}
const SearchBar = (props: IProps) => {

    function HandleChange(event: React.ChangeEvent<HTMLInputElement>) {
        props.onChange(event.target.value);
    }

    return (
        <div className="search_bar">
            <SearchIcon />
            <input
                type='text'
                placeholder={props.placeholder}
                value={props.value}
                onChange={HandleChange}
            />
        </div>

    );
}

export default SearchBar;