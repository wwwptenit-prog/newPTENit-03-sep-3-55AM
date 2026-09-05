import React from 'react';
import { Clock, BookOpen, Users, ArrowRight, CheckCircle2, PlayCircle } from 'lucide-react';
import { Course } from '../types';
import { useData } from '../context/DataContext';

interface CourseCardProps {
  course: Course;
  onOpenDetail: (courseId: string) => void;
  onQuickEnroll: (course: Course) => void;
  onStartLearning?: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onOpenDetail,
  onQuickEnroll,
  onStartLearning
}) => {
  const { t, currentUser, enrollments } = useData();

  const isEnrolled = currentUser
    ? enrollments.some(e => (e.userId === currentUser.id || (e as any).studentId === currentUser.id) && e.courseId === course.id)
    : false;

  const toBengaliNumber = (num: number | string): string => {
    const banglaDigits: { [key: string]: string } = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    return String(num).replace(/[0-9]/g, d => banglaDigits[d] || d);
  };

  const getBanglaDuration = (durationStr?: string): string => {
    if (!durationStr) return '৪ সপ্তাহ';
    let str = durationStr.replace(/\s*\([^)]*\)/, '').trim();
    str = toBengaliNumber(str);
    str = str.replace(/weeks?/i, 'সপ্তাহ')
             .replace(/months?/i, 'মাস')
             .replace(/hours?|hrs?/i, 'ঘণ্টা')
             .replace(/mins?|minutes?/i, 'মিনিট')
             .replace(/days?/i, 'দিন');
    return str;
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl border ${isEnrolled ? 'border-[#1DB954] shadow-sm dark:border-[#1DB954]/60' : 'border-slate-200/90 dark:border-slate-700/80 shadow-xs'} hover:shadow-lg hover:border-[#1DB954]/80 transition-all duration-300 flex flex-col overflow-hidden group`}>
      
      {/* Thumbnail: Large and clean */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
        <img
          src={course.thumbnail}
          alt={course.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Minimal Enrolled indicator only if already enrolled */}
        {isEnrolled && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-0.5 rounded-full bg-[#1DB954] text-white font-bold text-[9px] sm:text-[10px] shadow-sm uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-950" /> {t('এনরোল্ড', 'Enrolled')}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2">
        
        <div>
          <h3
            onClick={() => {
              if (isEnrolled && onStartLearning) {
                onStartLearning(course.id);
              } else {
                onOpenDetail(course.id);
              }
            }}
            className="text-xs sm:text-[13px] font-bold font-heading text-slate-800 dark:text-slate-100 hover:text-[#1DB954] transition-colors cursor-pointer line-clamp-2 leading-snug min-h-[2rem] sm:min-h-[2.25rem]"
            title={course.title}
          >
            {course.title}
          </h3>
        </div>

        {/* Course Info Micro Metrics - Clean icon on top, short Bangla text below */}
        <div className="grid grid-cols-3 gap-1 py-1.5 border-t border-slate-100 dark:border-slate-700/50">
          <div className="flex flex-col items-center justify-center text-center min-w-0">
            <Clock className="w-3.5 h-3.5 text-[#1DB954] mb-0.5 shrink-0" />
            <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate w-full leading-tight">
              {getBanglaDuration(course.duration)}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center text-center min-w-0">
            <BookOpen className="w-3.5 h-3.5 text-[#1DB954] mb-0.5 shrink-0" />
            <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate w-full leading-tight">
              {toBengaliNumber(course.lessonsCount || 1)} ক্লাস
            </span>
          </div>
          <div className="flex flex-col items-center justify-center text-center min-w-0">
            <Users className="w-3.5 h-3.5 text-[#1DB954] mb-0.5 shrink-0" />
            <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate w-full leading-tight">
              {toBengaliNumber(course.enrolledCount || 1)}+
            </span>
          </div>
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-slate-100 dark:border-slate-700/50">
          <div className="min-w-0">
            {isEnrolled ? (
              <span className="text-[10px] sm:text-[11px] font-bold text-[#1DB954] flex items-center gap-1 truncate">
                <CheckCircle2 className="w-3 h-3 text-[#1DB954] shrink-0" />
                <span>অ্যাক্টিভ কোর্স</span>
              </span>
            ) : course.isFree ? (
              <span className="text-xs sm:text-sm font-bold text-emerald-500 dark:text-emerald-400 block truncate leading-tight">
                {t('সম্পূর্ণ ফ্রি', 'Fully Free')}
              </span>
            ) : (
              <div className="flex flex-col">
                {course.discountPrice && (
                  <span className="text-[9px] sm:text-[10px] text-slate-400 line-through block leading-none truncate">
                    ৳{course.price.toLocaleString('bn-BD')}
                  </span>
                )}
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block truncate leading-tight">
                  ৳{(course.discountPrice || course.price).toLocaleString('bn-BD')}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {isEnrolled ? (
              <button
                type="button"
                onClick={() => {
                  if (onStartLearning) {
                    onStartLearning(course.id);
                  } else {
                    onOpenDetail(course.id);
                  }
                }}
                className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold text-white bg-[#1DB954] hover:bg-[#19a34a] shadow-xs transition-all cursor-pointer flex items-center gap-1 active:scale-95 shrink-0"
              >
                <PlayCircle className="w-3 h-3" />
                <span>{t('ক্লাসে যান', 'Go to Class')}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenDetail(course.id)}
                className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold text-white bg-[#1DB954] hover:bg-[#19a34a] shadow-xs transition-all cursor-pointer flex items-center gap-1 active:scale-95 shrink-0"
              >
                <span>{t('বিস্তারিত', 'Details')}</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
