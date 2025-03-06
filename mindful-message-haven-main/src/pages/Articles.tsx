
import AppLayout from "@/components/layout/AppLayout";
import { ArticleCard } from "@/components/ui/article-card";

export default function Articles() {
  const articles = [
    {
      category: "Reproductive Health",
      title: "Understanding PCOS: Symptoms, Causes, and Management",
      summary: "Polycystic Ovary Syndrome affects millions of women worldwide. Learn about the symptoms, causes, and effective management strategies.",
      author: {
        name: "Priya Sharma",
        title: "Gynecologist"
      },
      date: "April 5, 2023",
      readTime: "8 min read"
    },
    {
      category: "Menstrual Health",
      title: "The Connection Between Stress and Your Menstrual Cycle",
      summary: "Stress can significantly impact your menstrual cycle. Discover the science behind this connection and strategies to maintain hormonal balance.",
      author: {
        name: "Meera Kapoor",
        title: "Endocrinologist"
      },
      date: "March 22, 2023",
      readTime: "6 min read"
    },
    {
      category: "Cancer Awareness",
      title: "Breast Self-Examination: A Step-by-Step Guide",
      summary: "Regular breast self-examinations are crucial for early detection of breast cancer. Learn the proper technique with this comprehensive guide.",
      author: {
        name: "Anjali Rao",
        title: "Oncologist"
      },
      date: "April 1, 2023",
      readTime: "5 min read"
    },
    {
      category: "Nutrition",
      title: "Anti-Inflammatory Foods for Women's Health",
      summary: "Discover how incorporating anti-inflammatory foods into your diet can help manage conditions like PCOS, endometriosis, and menstrual pain.",
      author: {
        name: "Divya Patel",
        title: "Nutritionist"
      },
      date: "May 10, 2023",
      readTime: "7 min read"
    },
    {
      category: "Mental Health",
      title: "Managing Anxiety During Hormonal Fluctuations",
      summary: "Hormonal changes throughout the month can significantly impact anxiety levels. Learn effective strategies to manage anxiety during these fluctuations.",
      author: {
        name: "Shalini Kumar",
        title: "Psychiatrist"
      },
      date: "June 3, 2023",
      readTime: "9 min read"
    },
    {
      category: "Self-Defense",
      title: "Essential Self-Defense Moves Every Woman Should Know",
      summary: "Empower yourself with these practical self-defense techniques designed specifically for women's safety and confidence.",
      author: {
        name: "Neha Singh",
        title: "Self-Defense Instructor"
      },
      date: "May 25, 2023",
      readTime: "6 min read"
    }
  ];

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-10 animate-fadeIn">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Expert Health Articles</h1>
          <p className="text-xl text-muted-foreground">
            Reliable information written by healthcare professionals
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 staggered">
          {articles.map((article, i) => (
            <ArticleCard
              key={i}
              category={article.category}
              title={article.title}
              summary={article.summary}
              author={article.author}
              date={article.date}
              readTime={article.readTime}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
