import './Header.css';

interface HeaderProps {
  onTitleClick: () => void;
}

function Header({ onTitleClick }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-title" onClick={onTitleClick}>
        GDP POC 系統
      </div>
    </header>
  );
}

export default Header;
