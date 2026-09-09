'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { t, getStoredLocale, type Locale } from '@/lib/i18n';
import {
  getStoredUser,
  isLoggedIn,
  getStoredPosts,
  saveStoredPosts,
  type FeedPost,
  type StoredUser,
} from '@/lib/storage';
import { sanitizeInput, checkRateLimit } from '@/lib/security';
import {
  Newspaper,
  Heart,
  MessageSquare,
  Bookmark,
  Clock,
  Sparkles,
  TrendingUp,
  Flame,
  Plus,
  Search,
  Tag,
  UserCheck,
  UserPlus,
  X,
  Send,
  CheckCircle2,
} from 'lucide-react';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import styles from './page.module.css';

type FeedTab = 'for-you' | 'featured' | 'latest' | 'bookmarks';

export default function FeedsPage() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>('vi');
  const [user, setUser] = useState<StoredUser | null>(null);
  const [activeTab, setActiveTab] = useState<FeedTab>('for-you');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<FeedPost[]>([]);

  // Create post modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postExcerpt, setPostExcerpt] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postTags, setPostTags] = useState('reactjs, frontend');
  const [toastMsg, setToastMsg] = useState('');

  // Followed authors state
  const [followedAuthors, setFollowedAuthors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLocale(getStoredLocale());
    setUser(getStoredUser());
    setPosts(getStoredPosts());
  }, []);

  // ========== POST INTERACTIONS ==========
  const handleToggleLike = (postId: string) => {
    const updated = posts.map((post) => {
      if (post.id === postId) {
        const isLiked = !post.isLiked;
        return {
          ...post,
          isLiked,
          likes: isLiked ? post.likes + 1 : Math.max(0, post.likes - 1),
        };
      }
      return post;
    });
    setPosts(updated);
    saveStoredPosts(updated);
  };

  const handleToggleBookmark = (postId: string) => {
    const updated = posts.map((post) => {
      if (post.id === postId) {
        const isBookmarked = !post.isBookmarked;
        if (isBookmarked) {
          showToast('Đã lưu bài viết vào danh sách của bạn!');
        }
        return { ...post, isBookmarked };
      }
      return post;
    });
    setPosts(updated);
    saveStoredPosts(updated);
  };

  const handleToggleFollow = (authorName: string) => {
    setFollowedAuthors((prev) => ({
      ...prev,
      [authorName]: !prev[authorName],
    }));
  };

  // ========== CREATE NEW POST ==========
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim()) return;

    // Rate Limit Check (anti-spam 4 seconds)
    const rateCheck = checkRateLimit('create-feed-post', 4000);
    if (!rateCheck.allowed) {
      showToast(`Vui lòng chờ ${rateCheck.remainingSec}s trước khi đăng bài tiếp theo!`);
      return;
    }

    const cleanTitle = sanitizeInput(postTitle.trim());
    const cleanExcerpt = sanitizeInput(postExcerpt.trim() || postContent.slice(0, 120) + '...');
    const cleanContent = sanitizeInput(postContent.trim());

    const newPost: FeedPost = {
      id: `post-${Date.now()}`,
      author: {
        name: user ? sanitizeInput(user.name) : 'Cộng đồng EduVN',
        avatar: user ? user.avatar : '/avatars/demo-student.jpg',
        badge: user?.role === 'admin' ? 'Instructor' : 'Member',
        role: user?.email ? sanitizeInput(user.email) : 'Học viên EduVN',
      },
      title: cleanTitle,
      excerpt: cleanExcerpt,
      content: cleanContent,
      tags: postTags
        .split(',')
        .map((t) => sanitizeInput(t.trim().toLowerCase().replace('#', '')))
        .filter(Boolean),
      readTime: '3 phút đọc',
      createdAt: 'Vừa xong',
      likes: 1,
      commentsCount: 0,
      isLiked: true,
      featured: false,
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    saveStoredPosts(updated);
    setShowCreateModal(false);
    setPostTitle('');
    setPostExcerpt('');
    setPostContent('');
    showToast('Đăng bài viết mới thành công!');
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // ========== FILTERING LOGIC ==========
  const filteredPosts = posts.filter((post) => {
    // Tab filter
    if (activeTab === 'featured' && !post.featured) return false;
    if (activeTab === 'bookmarks' && !post.isBookmarked) return false;

    // Tag filter
    if (selectedTag !== 'all' && !post.tags.includes(selectedTag)) return false;

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchExcerpt = post.excerpt.toLowerCase().includes(q);
      const matchAuthor = post.author.name.toLowerCase().includes(q);
      if (!matchTitle && !matchExcerpt && !matchAuthor) return false;
    }

    return true;
  });

  const popularTags = ['all', 'reactjs', 'nextjs', 'frontend', 'fullstack', 'devops', 'css', 'roadmap'];

  const topAuthors = [
    { name: 'Sơn Đặng', role: 'Founder @ EduVN', followers: '45.2K' },
    { name: 'Trần Hoàng Nam', role: 'Fullstack Dev', followers: '12.8K' },
    { name: 'Lê Thị Bích', role: 'UI/UX Designer', followers: '9.4K' },
    { name: 'Phạm Minh Đức', role: 'Cloud Architect', followers: '8.1K' },
  ];

  return (
    <div className={styles.page}>
      <div className={`glow-orb glow-orb-purple ${styles.orb1}`} />
      <div className={`glow-orb glow-orb-cyan ${styles.orb2}`} />

      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 1000,
            background: 'rgba(34, 197, 94, 0.9)',
            color: '#ffffff',
            padding: '0.85rem 1.25rem',
            borderRadius: '14px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={18} />
          {toastMsg}
        </div>
      )}

      <div className="container">
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.headerTitle}>
              <Newspaper size={32} style={{ color: '#c084fc' }} />
              Bản Tin Công Nghệ & Bài Viết
            </h1>
            <p className={styles.headerSubtitle}>
              Tổng hợp kinh nghiệm lập trình, xu hướng công nghệ và chia sẻ từ cộng đồng EduVN
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => {
              if (!isLoggedIn()) {
                router.push('/login');
              } else {
                setShowCreateModal(true);
              }
            }}
          >
            <Plus size={18} />
            Viết bài mới
          </button>
        </div>

        {/* Layout Grid */}
        <div className={styles.layout}>
          {/* Main Feed Content */}
          <main className={styles.feedContent}>
            {/* Tabs Row */}
            <div className={styles.tabsRow}>
              <div className={styles.tabsGroup}>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'for-you' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('for-you')}
                >
                  <Sparkles size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  Dành cho bạn
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'featured' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('featured')}
                >
                  <Flame size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  Bài viết nổi bật
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'latest' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('latest')}
                >
                  <Clock size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  Mới nhất
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === 'bookmarks' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('bookmarks')}
                >
                  <Bookmark size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  Đã lưu ({posts.filter((p) => p.isBookmarked).length})
                </button>
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', width: '220px' }}>
                <Search
                  size={15}
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                  }}
                />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Tìm bài viết..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '2.4rem', fontSize: '0.85rem', height: '38px' }}
                />
              </div>
            </div>

            {/* Tags Pills */}
            <div className={styles.tagsRow}>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  className={`${styles.tagPill} ${selectedTag === tag ? styles.tagPillActive : ''}`}
                  onClick={() => setSelectedTag(tag)}
                >
                  #{tag}
                </button>
              ))}
            </div>

            {/* Posts List */}
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <article key={post.id} className={styles.postCard}>
                  {post.featured && (
                    <span className={styles.featuredBadge}>
                      <Flame size={12} /> Nổi bật
                    </span>
                  )}

                  {/* Author Header */}
                  <div className={styles.authorRow}>
                    <div className={styles.authorMeta}>
                      <div className={styles.avatar}>
                        {post.author.name.charAt(0).toUpperCase()}
                      </div>
                      <div className={styles.authorInfo}>
                        <div className={styles.authorNameRow}>
                          <span className={styles.authorName}>{post.author.name}</span>
                          {post.author.badge && (
                            <span className={styles.badgePro}>{post.author.badge}</span>
                          )}
                        </div>
                        <span className={styles.postTime}>
                          {post.author.role ? `${post.author.role} • ` : ''}
                          {post.createdAt}
                        </span>
                      </div>
                    </div>

                    <button
                      className={`${styles.bookmarkBtn} ${post.isBookmarked ? styles.bookmarked : ''}`}
                      onClick={() => handleToggleBookmark(post.id)}
                      title={post.isBookmarked ? 'Bỏ lưu' : 'Lưu bài viết'}
                    >
                      <Bookmark size={20} fill={post.isBookmarked ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  {/* Title & Excerpt */}
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <p className={styles.postExcerpt}>{post.excerpt}</p>

                  {/* Tags */}
                  <div className={styles.postTags}>
                    {post.tags.map((t) => (
                      <span key={t} className={styles.postTag}>
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Reactions Footer */}
                  <div className={styles.postFooter}>
                    <div className={styles.reactionBtns}>
                      <button
                        className={`${styles.actionBtn} ${post.isLiked ? styles.liked : ''}`}
                        onClick={() => handleToggleLike(post.id)}
                      >
                        <Heart size={16} fill={post.isLiked ? 'currentColor' : 'none'} />
                        <span>{post.likes}</span>
                      </button>

                      <button className={styles.actionBtn}>
                        <MessageSquare size={16} />
                        <span>{post.commentsCount} bình luận</span>
                      </button>
                    </div>

                    <div className={styles.readTime}>
                      <Clock size={14} />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="card" style={{ textAlgin: 'center', padding: '3rem 1.5rem' }}>
                <Newspaper size={48} style={{ color: '#94a3b8', margin: '0 auto 1rem' }} />
                <h3 style={{ color: '#ffffff', fontSize: '1.1rem' }}>Không tìm thấy bài viết nào</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  Thử chọn danh mục khác hoặc tạo bài viết đầu tiên của bạn!
                </p>
              </div>
            )}
          </main>

          {/* Right Sidebar */}
          <aside className={styles.sidebar}>
            {/* Create Post Card CTA */}
            <div className={styles.createCard}>
              <h3 className={styles.createTitle}>Chia Sẻ Kiến Thức Lập Trình</h3>
              <p className={styles.createSub}>
                Cùng đóng góp bài viết, kinh nghiệm thực chiến và câu hỏi thảo luận với cộng đồng EduVN.
              </p>
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => {
                  if (!isLoggedIn()) router.push('/login');
                  else setShowCreateModal(true);
                }}
              >
                <Plus size={16} /> Viết bài mới ngay
              </button>
            </div>

            {/* Trending Topics */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>
                <TrendingUp size={18} style={{ color: '#c084fc' }} />
                Chủ Đề Hot Đang Thảo Luận
              </h3>
              <div className={styles.topicList}>
                {[
                  { tag: '#reactjs', count: '142 bài viết' },
                  { tag: '#nextjs', count: '98 bài viết' },
                  { tag: '#javascript', count: '215 bài viết' },
                  { tag: '#fullstack', count: '76 bài viết' },
                  { tag: '#devops', count: '54 bài viết' },
                ].map((item) => (
                  <div
                    key={item.tag}
                    className={styles.topicItem}
                    onClick={() => setSelectedTag(item.tag.replace('#', ''))}
                  >
                    <span style={{ fontWeight: 600 }}>{item.tag}</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Authors */}
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>
                <Sparkles size={18} style={{ color: '#38bdf8' }} />
                Tác Giả Nổi Bật
              </h3>
              <div className={styles.authorList}>
                {topAuthors.map((author) => {
                  const isFollowing = followedAuthors[author.name];
                  return (
                    <div key={author.name} className={styles.authorCard}>
                      <div className={styles.authorMetaSmall}>
                        <div className={styles.avatarSmall}>{author.name.charAt(0)}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.875rem' }}>
                            {author.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            {author.followers} theo dõi
                          </div>
                        </div>
                      </div>

                      <button
                        className={styles.followBtn}
                        onClick={() => handleToggleFollow(author.name)}
                      >
                        {isFollowing ? (
                          <>
                            <UserCheck size={12} style={{ display: 'inline', marginRight: '4px' }} />
                            Đã theo dõi
                          </>
                        ) : (
                          <>
                            <UserPlus size={12} style={{ display: 'inline', marginRight: '4px' }} />
                            Theo dõi
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* TOAST FEEDBACK */}
      <Toast message={toastMsg} />

      {/* CREATE POST MODAL */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Viết Bài Bảng Tin Mới"
        footer={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Hủy
            </button>
            <button
              type="submit"
              form="create-post-form"
              className="btn btn-primary"
            >
              <Send size={16} /> Đăng bài
            </button>
          </>
        }
      >
        <form id="create-post-form" onSubmit={handleCreatePost} className={styles.formGroup}>
          <div>
            <label className="input-label">Tiêu đề bài viết</label>
            <input
              type="text"
              className="input-field"
              placeholder="Ví dụ: Mẹo tối ưu ứng dụng ReactJS năm 2026..."
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="input-label">Thẻ Hashtags (ngăn cách bằng dấu phẩy)</label>
            <input
              type="text"
              className="input-field"
              placeholder="reactjs, nextjs, frontend"
              value={postTags}
              onChange={(e) => setPostTags(e.target.value)}
            />
          </div>

          <div>
            <label className="input-label">Tóm tắt ngắn</label>
            <input
              type="text"
              className="input-field"
              placeholder="Mô tả ngắn gọn nội dung chính..."
              value={postExcerpt}
              onChange={(e) => setPostExcerpt(e.target.value)}
            />
          </div>

          <div>
            <label className="input-label">Nội dung bài viết</label>
            <textarea
              className="input-field"
              rows={6}
              placeholder="Chia sẻ kiến thức, đoạn code hoặc hướng dẫn chi tiết của bạn tại đây..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              required
              style={{ resize: 'vertical' }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
