import React from "react";
import Image from "next/image";
import { ChevronRight, Calendar, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const metadata = {
  title: "Discover Bali | Premium Island Blog",
};

// Helper to strip HTML and get excerpt
const getExcerpt = (html, length = 120) => {
  if (!html) return '';
  const text = html.replace(/<[^>]+>/g, '');
  return text.length > length ? text.substring(0, length) + '...' : text;
};

// Helper to reliably construct blog URLs
const getBlogUrl = (slug) => {
  if (!slug) return '/blog';
  const cleanSlug = slug.replace(/^\/?(blog\/)?/, '');
  return `/blog/${cleanSlug}`;
};

export const revalidate = 3600; // Server-side caching for 1 hour

export default async function Blog() {
  let articles = [];
  try {
    const { data: dbArticles, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('status', 'Published')
      .order('created_at', { ascending: false });

    if (!error && dbArticles) {
      articles = dbArticles;
    }
  } catch (e) {
    console.error("Error loading blogs:", e);
  }

  return (
    <div className="w-full bg-background min-h-screen font-sans">

      <div className="container mx-auto px-4 lg:max-w-7xl relative z-20 pb-24 pt-4 md:pt-8">
        {articles.length === 0 ? (
          <div className="text-center py-24 bg-surface rounded-[32px] border border-border shadow-floating">
            <Sparkles size={48} className="mx-auto text-gray-300 mb-6" />
            <h3 className="text-3xl font-black text-primary mb-3">More Content Coming Soon</h3>
            <p className="text-text-secondary text-lg font-medium">We are currently crafting amazing new articles for you.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-10">
              <h1 className="text-3xl lg:text-4xl font-black text-primary">All Articles</h1>
              <div className="h-0.5 flex-1 bg-gray-200 mt-2"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link key={article.id} href={getBlogUrl(article.slug)} className="bg-surface border border-border rounded-[24px] shadow-soft flex flex-col group cursor-pointer hover:shadow-floating hover:-translate-y-2 transition-all duration-500 overflow-hidden block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    {article.image ? (
                      <Image src={article.image} alt={article.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-black flex items-center justify-center text-white/10 text-3xl font-black">DB</div>
                    )}
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-extrabold text-white shadow-sm tracking-widest uppercase border border-white/10">
                      {article.category || 'Guides'}
                    </div>
                  </div>

                  <div className="p-6 lg:p-8 flex flex-col flex-1 bg-white relative">
                    <h3 className="text-2xl font-black mb-3 line-clamp-2 text-primary group-hover:text-black transition-colors leading-[1.2]">{article.title}</h3>
                    <p className="text-sm font-medium text-gray-500 mb-8 line-clamp-3 leading-relaxed">{article.meta_description || getExcerpt(article.content)}</p>

                    <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between text-sm">
                      <span className="font-bold text-gray-400">{new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="text-primary group-hover:text-accent font-black flex items-center gap-1 group-hover:translate-x-1 transition-transform uppercase tracking-widest text-xs">Read <ChevronRight size={16} /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
