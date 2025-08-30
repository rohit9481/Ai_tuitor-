import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Learn',
      path: '/question-generation-assessment',
      icon: 'BookOpen',
      description: 'Generate questions and start learning'
    },
    {
      label: 'Progress',
      path: '/progress',
      icon: 'TrendingUp',
      description: 'Track your learning progress'
    },
    {
      label: 'Sessions',
      path: '/sessions',
      icon: 'Clock',
      description: 'Manage learning sessions'
    }
  ];

  const isActivePath = (path) => {
    if (path === '/question-generation-assessment') {
      return location.pathname === '/question-generation-assessment' || 
             location.pathname === '/adaptive-learning-explanations';
    }
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Icon name="Brain" size={20} color="white" />
            </div>
            <span className="font-heading font-semibold text-lg text-foreground">
              AdaptiveLearning
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 ml-8">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActivePath(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="ml-auto flex items-center space-x-2 pr-4">
          {/* Help Button */}
          <Button
            variant="ghost"
            size="sm"
            iconName="HelpCircle"
            iconPosition="left"
            className="hidden sm:flex"
          >
            Help
          </Button>

          {/* Settings Button */}
          <Button
            variant="ghost"
            size="icon"
            iconName="Settings"
            className="hidden sm:flex"
          />

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            iconName={isMobileMenuOpen ? "X" : "Menu"}
            onClick={toggleMobileMenu}
            className="md:hidden"
          />
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-card">
          <nav className="flex flex-col space-y-1 p-4">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <div>
                  <div>{item?.label}</div>
                  <div className="text-xs opacity-70">{item?.description}</div>
                </div>
              </Link>
            ))}
            
            {/* Mobile Help & Settings */}
            <div className="border-t pt-4 mt-4 space-y-1">
              <button className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full">
                <Icon name="HelpCircle" size={18} />
                <span>Help & Support</span>
              </button>
              <button className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full">
                <Icon name="Settings" size={18} />
                <span>Settings</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;