- 2 λpat: A starting point

	We introduce a simply typed programming language λpat, which essentially extends the simply typed λ-calculus with pattern matching.

	我々は基本的にパターンマッチングと単純に型付けされたλ計算を拡張し、単純に型付けされたプログラミング言語λpatを、紹介します。

	We emphasize that there are no new contributions in this section.

	我々は、このセクションに新たな貢献がないことを強調する。

	Instead, we primarily use λpat as an example to show how a type system is developed.

	その代わりに、我々は主に例としてλpat使用型システムが開発されているかを表示します。

	In particularly, we show how various properties of λpat are chained together in order to establish the type soundness of λpat. 

	特に、我々はλpatの様々な特性がλpatの型の健全性を確立するために、一緒に連鎖される方法を示しています。

	The subsequent development of the dependent type system in Section 4 and all of its extensions will be done in parallel to the development of λpat.

	4章とその拡張のすべての依存型システムのその後の開発はλpatの発展に並行して行われる。

	Except Lemma 2.14, all the results in this section are well-known and thus their proofs are　omitted.

	補題2.14を除いて、このセクションのすべての結果は、よく知られているので、それらの証明は省略します。

	----

	- Fig. 3. The syntax for λpat

			base types    δ ::= bool | int | . . .
			types         τ ::= δ | 1 | τ1 ∗ τ2 | τ1 → τ2
			patterns      p ::= x | f | hi | <p1, p2> | cc(p)
			matching clause seq. ms ::= (p1 ⇒ e1 | · · · | pn ⇒ en)
			constants     c ::= cc | cf
			expressions   e ::= xf | c(e) | hi | <e1, e2> | fst(e) | snd(e) | case e of ms |
			                    lam x. e | e1(e2) | fix f. e | let x = e1 in e2 end
			values        v ::= x | cc(v) | hi | <v1, v2> | lam x. e
			contexts      Γ ::= · | Γ, xf : τ
			substitutions θ ::= [] | θ[x 7→ v] | θ[f 7→ e]

	The syntax of λpat is given in Figure 3.

	λpatの構文は、図3に示されている。

	We use δ for base types such as int and bool and τ for types.

	我々はint型とブールの基本型用のδと型のτを使用しています。

	We use x for lam-bound variables and f for fix-bound variables, and xf for either x or f.

	我々は、xの為のlam-バインド変数とfにfix-バインドされた変数、およびxかfのいずれかのためにxfを使用しています。

	Given an expression e, we write FV(e) for the set of free variables xf in e, which is defined as usual.

	式eを考えると、我々はいつものように定義されているe内の自由変数の集合 xfをFV（e）と書く。

	----

	A lam-bound variable is considered a value but a fix-bound variable is not.

	lam-バインドされた変数は、値とみなされるがfix-バインド変数はありません。

	We use the name observable value for a closed value that does not contain a lambda expression lam x. e as its substructure.

	我々は、その基礎としてラムダ式のlam x. eが含まれていない、閉じた値の名前に観察可能な値を使用します。

	We use c for a constant, which is either a constant constructor cc or a constant function cf .

	我々は、定数コンストラクタccまたは定数関数cfのどちらかである定数、cを使用します。

	Each constant c is assigned a constant type (or c-type, for short) of the form τ ⇒ δ.

	各定数cは、τ⇒δの形の（略して、またはc型）定数型が割り当てられます。
	
	----

	Note that a c-type is not regarded as a (regular) type.

	c型は（レギュラー）型とはみなされないことに注意してください。

	For each constant constructor cc assigned the type 1 ⇒ δ, we may write cc as a shorthand for cc(<>), where <> stands for the unit of the unit type 1.

	型 1 ⇒ δ を割り当てられた各定数コンストラクタccのために、我々は、cc(<>)の省略形として、ccを書き、<>でユニット型1の単位を表します。

	In the following presentation, we assume that the boolean values true and false are assigned the type 1 ⇒ bool and every integer i is assigned the type 1 ⇒ int.

	以下の発表では、trueとfalseのbool値は、1⇒bool型が割り当てられ、すべての整数 i が1⇒int型を割り当てられていることを前提としています。

	Note that we do not treat the tuple constructor <·, ·> as a special case of constructors.

	我々は、コンストラクタの特殊なケースとして、タプルコンストラクタ<·, ·>を扱わないことに注意してください。

	Instead, we introduce tuples into λpat explicitly.

	その代わりに、我々は、明示的にλpatにタプルを導入する。

	The primary reason for this decision is that tuples are to be handled specially in Section 5, where an elaboration procedure is presented for supporting a form of partial type inference in the presence of dependent types.

	このように決めた主な理由は、5章で特別に扱われていますが、タプルの詳細な手順は依存型の存在下で部分的な型推論の形式をサポートするために提示されているためです。

	----


	We use θ for a substitution, which is a finite mapping that maps lam-bound variables x to values and fix-bound variables to fixed-point expressions.

	我々は、lam-bound変数xから値へ、fix-bound変数から固定小数点式へマッピングする有限の写像である置換のためθを使用します。

	We use [] for the empty substitution and θ[xf 7→ e] for the substitution that extends θ with a link from xf to e, where it is assumed that xf is not in the domain dom(θ) of θ.

	我々は、空の置換に[]を使用し、xfからeまでのリンクをθを拡張した置換のためにθ[xf 7 → e]使用し、ここでのxfはθのドメインのdom(θ)に登録されていないものとする。

	Also, we may write [xf1 |-> e1,..., xf n |-> en] for a substitution that maps xf i to ei for 1 ≤ i ≤ n.

	また、我々は1≤i≤nの範囲でxfiからeiへマップの置換を[xf1 |-> e1,..., xf n |-> en]と書くことができます。

	We omit the further details on substitution, which are completely standard.

	我々は完全に標準的な置換に関するさらなる詳細は、省略します。

	Given a piece of syntax • (representing expressions, evaluation contexts, etc.), we use •[θ] for the result of applying θ to •.

	構文•（式や評価コンテキスト等を表す）が与えられたとき、我々はθ を• に適用した結果のために•[θ]を使用する。

	----

	We use ∅ for the empty context and Γ, xf : τ for the context that extends Γ with one additional declaration xf : τ , where we assume that xf is not already declared in Γ.

	我々は、空のコンテキストに対して∅使用し、xfがすでにΓで宣言されていないと仮定して一つの追加の宣言xf : τでΓを拡張したコンテキストΓ, xf : τを使用します。


	A context `Γ = ∅, xf: τ1,...,xfn: τn` may also be treated as a finite mapping that maps xfi to τi for 1 ≤ i ≤ n, and we use dom(Γ) for the domain of Γ. 

	コンテキスト`Γ = ∅, xf: τ1,...,xfn: τn`はまた1 ≤ i ≤ nの範囲でxfi から τi への有限のマッピングとして処理することができ、そして我々はΓのドメインのdom(Γ)を使用します。

	Also, we may use Γ, Γ' for the context ∅, xf': τ1, ..., xfn : τn, xf'1 : τ'1,..., xf'n: τ'n , where Γ = ∅, xf 1: τ1,..., xfn : τn' and Γ' = ∅, xf'1: τ'1,..., xf'n: τ'n' and all variables xf1,...,xfn,xf'1,...,xf'n' are distinct.

	また、我々は、コンテキスト∅,xf': τ1, ..., xfn : τn, xf'1 : τ'1,..., xf'n: τ'nでΓ, Γ'を使用することができ、ここで Γ = ∅, xf 1: τ1,..., xfn : τn' で Γ' = ∅, xf'1: τ'1,..., xf'n: τ'n' で全ての変数 xf1,...,xfn,xf'1,...,xf'n' は異なります。

	----

	As a form of syntactic sugar, we may write let <x1, x2> = e1 in e2 end for the following expression:

	構文糖の形として、我々は次の式の事を let <x1, x2> = e1 in e2 end と書くことがあります:

		let x = e1 in let x1 = fst(x) in let x2 = snd(x) in e2 end end end

	where x is assumed to have no free occurrences in e1, e2.

	ここで、xは、e1とe2に自由変数として出現しないと仮定します。


