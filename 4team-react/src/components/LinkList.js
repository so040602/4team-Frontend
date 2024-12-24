import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import styled from 'styled-components';

const PageTitle = styled.h2`
    font-size: 2rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 2rem;
    text-align: center;
    position: relative;
    
    &:after {
        content: '';
        display: block;
        width: 60px;
        height: 3px;
        background-color: #ff6b6b;
        margin: 15px auto 0;
    }
`;

const StyledCard = styled.div`
    background: #fff;
    border-radius: 15px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    border: 1px solid #eee;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .card-body {
        padding: 1.5rem;
    }

    .card-title {
        font-size: 1.3rem;
        font-weight: 600;
        color: #333;
        margin-bottom: 1.5rem;
    }
`;

const SocialButton = styled.a`
    display: inline-flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.3s ease;
    background: ${props => props.$platform === 'instagram' ? 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' : '#1877f2'};
    color: white;
    border: none;

    &:hover {
        transform: translateY(-2px);
        opacity: 0.9;
        color: white;
    }

    i {
        margin-right: 8px;
        font-size: 1.2rem;
    }
`;

const SocialLink = styled.div`
    display: flex;
    align-items: center;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 10px;
    margin-bottom: 1rem;

    span {
        flex: 1;
        font-size: 1rem;
        color: #444;
        margin-right: 1rem;
    }
`;

const LinkList = () => {
  const links = {
    youtube: "https://www.youtube.com/embed/LZEhXqKRwIA",
    instagram: "https://www.instagram.com/p/C3d9Cu6Scoe/",
    facebook: "https://www.facebook.com/reel/897009902529881"
  };
  const [isDesktop, setIsDesktop] = useState(window.matchMedia("(min-width: 769px)").matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 769px)");
    const handler = (e) => setIsDesktop(e.matches);
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }, []);

  return (
    <div className="container" style={{margin: isDesktop ? '180px auto' : '120px auto'}}>
      
      {/* YouTube 영상 섹션 */}
      <StyledCard className="mb-4">
        <div className="card-body">
          <h5 className="card-title">요즘 인기 있는 요리 유튜브 영상</h5>
          <div className="ratio ratio-16x9">
            <iframe
              src={links.youtube}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </StyledCard>

      {/* 소셜 미디어 링크 섹션 */}
      <StyledCard>
        <div className="card-body">
          <h5 className="card-title">소셜 미디어에서 인기 있는 요리</h5>
          <SocialLink>
            <span>요즘 인기 있는 요리</span>
            <SocialButton 
              href={links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              $platform="instagram"
            >
              <i className="fab fa-instagram"></i>
              Instagram 바로가기
            </SocialButton>
          </SocialLink>
          <SocialLink>
            <span>요즘 인기 있는 요리</span>
            <SocialButton 
              href={links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              $platform="facebook"
            >
              <i className="fab fa-facebook"></i>
              Facebook 바로가기
            </SocialButton>
          </SocialLink>
        </div>
      </StyledCard>
    </div>
  );
};

export default LinkList;