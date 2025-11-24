from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models
from datetime import datetime, timedelta

class AIService:
    def __init__(self, db: Session, user_id: int):
        self.db = db
        self.user_id = user_id

    def generate_insights(self):
        insights = []
        
        # 1. Analyze Spending Trends
        total_expenses = self.db.query(func.sum(models.Expense.amount)).filter(models.Expense.owner_id == self.user_id).scalar() or 0.0
        total_income = self.db.query(func.sum(models.Income.amount)).filter(models.Income.owner_id == self.user_id).scalar() or 0.0
        
        if total_expenses > total_income:
            insights.append({
                "type": "warning",
                "title": "Spending Alert",
                "message": f"You've spent ${total_expenses - total_income:.2f} more than you earned. Consider cutting back on non-essential expenses."
            })
        elif total_income > total_expenses:
            savings = total_income - total_expenses
            insights.append({
                "type": "success",
                "title": "Savings Opportunity",
                "message": f"Great job! You have a surplus of ${savings:.2f}. Consider investing this or adding it to your emergency fund."
            })

        # 2. Category Analysis (Simple Rule)
        # Find the category with the highest expense
        top_category = self.db.query(models.Expense.category, func.sum(models.Expense.amount))\
            .filter(models.Expense.owner_id == self.user_id)\
            .group_by(models.Expense.category)\
            .order_by(func.sum(models.Expense.amount).desc())\
            .first()

        if top_category:
            category, amount = top_category
            insights.append({
                "type": "info",
                "title": "Top Spending Category",
                "message": f"Your highest spending is in '{category}' (${amount:.2f}). Is this expected?"
            })

        # 3. Goal Tracking
        active_goals = self.db.query(models.Goal).filter(models.Goal.owner_id == self.user_id).count()
        if active_goals == 0:
            insights.append({
                "type": "suggestion",
                "title": "Set a Goal",
                "message": "You don't have any active financial goals. Setting a goal is the first step to financial freedom!"
            })

        return insights
