import { useContext } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';

const useGlobalContext = () => useContext(GlobalContext);

export default useGlobalContext;
