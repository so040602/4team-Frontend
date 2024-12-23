import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const LinkList = () => {
  // 실제 링크들은 관리자가 수정할 수 있도록 나중에 상태 관리나 DB에서 가져올 수 있습니다
  const links = {
    youtube: "https://www.youtube.com/embed/LZEhXqKRwIA", // YouTube 임베드 URL로 변경
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
    <div className="container mt-4" >
      
      {/* YouTube 영상 섹션 */}
      <div className="card mb-4" style={{margin: isDesktop ? '180px auto' : '120px auto'}}>
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
      </div>

      {/* 소셜 미디어 링크 섹션 */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">소셜 미디어 링크</h5>
          <div className="d-flex flex-column gap-3">
            <div className="d-flex align-items-center">
              <span className="me-3">요즘 인기 있는 요리</span>
              <a 
                href={links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary"
              >
                <i className="fab fa-instagram fa-lg me-2"></i>
                Instagram 바로가기
              </a>
            </div>
            <div className="d-flex align-items-center">
              <span className="me-3">요즘 인기 있는 요리</span>
              <a 
                href={links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary"
              >
                <i className="fab fa-facebook fa-lg me-2"></i>
                Facebook 바로가기
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkList;